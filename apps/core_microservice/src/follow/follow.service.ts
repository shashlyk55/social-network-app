import { Injectable } from '@nestjs/common';
import {
  FollowToYourself,
  UserAlreadyFollowed,
  UserNotFollowed,
} from './exceptions/follow.exceptions';
import { Repository } from 'typeorm';
import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilesService } from 'src/profiles/profiles.service';
import { FollowPaginationResult } from './types/follow-params.types';

export enum FollowStatusFilter {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  ALL = 'all',
}

export enum FollowDirection {
  FOLLOWING = 'following',
  FOLLOWERS = 'followers',
}

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(ProfileFollow)
    private readonly followRepository: Repository<ProfileFollow>,
    private readonly profilesService: ProfilesService,
  ) {}

  async getFollows(
    userId: number,
    direction: FollowDirection,
    status: FollowStatusFilter = FollowStatusFilter.ALL,
    page: number = 1,
    limit: number = 50,
  ): Promise<FollowPaginationResult> {
    const profile = await this.profilesService.findByUserId(userId);

    const query = this.followRepository.createQueryBuilder('follow');

    if (direction === FollowDirection.FOLLOWING) {
      // current user - follower
      query
        .leftJoinAndSelect('follow.followedProfile', 'profileData')
        .where('follow.follower_profile_id = :profileId', {
          profileId: profile.id,
        });
    } else {
      // followers of current user
      query
        .leftJoinAndSelect('follow.followerProfile', 'profileData')
        .where('follow.followed_profile_id = :profileId', {
          profileId: profile.id,
        });
    }

    if (status === FollowStatusFilter.ACCEPTED) {
      query.andWhere('follow.accepted = :status', { status: true });
    } else if (status === FollowStatusFilter.PENDING) {
      query.andWhere('follow.accepted = :status', { status: false });
    }

    const skip = (page - 1) * limit;
    const [data, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('follow.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
      accepted: targetProfile.isPublic ? true : false,
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
