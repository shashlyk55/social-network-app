import { Injectable } from '@nestjs/common';
import {
  FollowToYourself,
  UserAlreadyFollowed,
  UserNotFollowed,
} from './exceptions/follow.exceptions';
import { Repository } from 'typeorm';
import {
  FollowDirection,
  FollowStatusFilter,
  ProfileFollow,
} from 'src/entities/many-to-many/profile-follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilesService } from 'src/profiles/profiles.service';
import { PrivateProfileException } from 'src/profiles/exceptions/profile.exceptions';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(ProfileFollow)
    private readonly followRepository: Repository<ProfileFollow>,
    private readonly profilesService: ProfilesService,
  ) {}

  async getFollows(
    userId: number,
    targetProfileId: number,
    direction: FollowDirection,
    page: number = 1,
    limit: number = 50,
  ): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const currentUserProfile = await this.profilesService.findByUserId(userId);
    const targetProfile = await this.profilesService.findOne(targetProfileId);

    if (targetProfile.id !== currentUserProfile.id && !targetProfile.isPublic) {
      const followRelation = await this.findFollow(
        currentUserProfile.id,
        targetProfile.id,
      );
      if (!followRelation || !followRelation.accepted) {
        throw new PrivateProfileException();
      }
    }

    const query = this.followRepository.createQueryBuilder('follow');

    if (direction === FollowDirection.FOLLOWING) {
      query
        .leftJoin('follow.followedProfile', 'profile') // Джойним профиль, на которого подписаны
        .addSelect([
          'profile.id',
          'profile.username',
          'profile.displayName',
          'profile.avatarUrl',
        ])
        .where('follow.follower_profile_id = :profileId', {
          profileId: targetProfile.id,
        });
    } else {
      query
        .leftJoin('follow.followerProfile', 'profile') // Джойним профиль подписчика
        .addSelect([
          'profile.id',
          'profile.username',
          'profile.displayName',
          'profile.avatarUrl',
        ])
        .where('follow.followed_profile_id = :profileId', {
          profileId: targetProfile.id,
        });
    }

    const [items, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('follow.createdAt', 'DESC')
      .getManyAndCount();

    const profileItems = await Promise.all(
      items.map(async (rel) => {
        const profile =
          direction === FollowDirection.FOLLOWING
            ? rel.followedProfile
            : rel.followerProfile;

        return { ...profile };
      }),
    );

    return {
      data: profileItems,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async follow(userId: number, targetProfileId: number) {
    const profile = await this.profilesService.findByUserId(userId);
    const targetProfile = await this.profilesService.findOne(targetProfileId);

    if (profile.id === targetProfileId) {
      throw new FollowToYourself();
    }

    const existingFollow = await this.findFollow(profile.id, targetProfileId);

    if (existingFollow) {
      throw new UserAlreadyFollowed();
    }

    const follow = this.followRepository.create({
      followerProfileId: profile.id,
      followedProfileId: targetProfileId,
      accepted: targetProfile.isPublic,
      createdById: userId,
      createdAt: new Date(),
    });

    return this.followRepository.save(follow);
  }

  async unfollow(userId: number, targetProfileId: number) {
    const profile = await this.profilesService.findByUserId(userId);
    await this.profilesService.findOne(targetProfileId);

    const existingFollow = await this.findFollow(profile.id, targetProfileId);
    if (!existingFollow) {
      throw new UserNotFollowed();
    }

    const result = await this.followRepository.delete({
      followerProfileId: profile.id,
      followedProfileId: targetProfileId,
    });

    return { success: true };
  }

  private async findFollow(
    followerProfileId: number,
    targetProfileId: number,
  ): Promise<ProfileFollow | null> {
    const existingFollow = await this.followRepository.findOne({
      where: {
        followerProfileId: followerProfileId,
        followedProfileId: targetProfileId,
      },
    });

    return existingFollow;
  }

  async acceptRequest(userId: number, followerProfileId: number) {
    const profile = await this.profilesService.findByUserId(userId);
    const existingFollow = await this.findFollow(followerProfileId, profile.id);

    if (!existingFollow) {
      throw new UserNotFollowed();
    }
    await this.followRepository.update(existingFollow.id, {
      accepted: true,
    });

    return await this.findFollow(followerProfileId, profile.id);
  }

  async rejectRequest(userId: number, followerProfileId: number) {
    const profile = await this.profilesService.findByUserId(userId);

    await this.followRepository.delete({
      followedProfileId: profile.id,
      followerProfileId: followerProfileId,
    });
  }
}
export { FollowDirection, FollowStatusFilter };
