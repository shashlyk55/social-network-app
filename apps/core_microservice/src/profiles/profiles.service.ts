import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import {
  UsernameAlreadyExistsException,
  ProfileOperationException,
  ProfileNotFoundException,
} from './exceptions/profile.exceptions';
import {
  CreateProfileParams,
  UpdateProfileParams,
} from './types/profile-params.types';
import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ProfileFollow)
    private readonly followRepository: Repository<ProfileFollow>,
  ) {}

  async create(params: CreateProfileParams): Promise<Profile> {
    try {
      const existing = await this.profileRepository.findOne({
        where: { username: params.username },
      });
      if (existing) {
        throw new UsernameAlreadyExistsException(params.username);
      }

      const profile = this.profileRepository.create(params);
      const savedProfile = await this.profileRepository.save(profile);

      return savedProfile;
    } catch (error: any) {
      if (error instanceof DomainException) throw error;
      throw new ProfileOperationException('create profile', error.message);
    }
  }

  async searchProfiles(
    query: string,
    currentUserId?: number,
  ): Promise<Profile[]> {
    const currentUserProfile: Profile | undefined = currentUserId
      ? await this.findByUserId(currentUserId)
      : undefined;

    const queryBuilder = this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.username ILIKE :search', { search: `%${query}%` })
      .take(10);

    if (currentUserProfile) {
      queryBuilder.andWhere('profile.id != :currentUserProfileId', {
        currentUserProfileId: currentUserProfile.id,
      });

      queryBuilder.addSelect((subQuery) => {
        return subQuery
          .select('COUNT(f.id) > 0', 'isFollowed')
          .from('main.profiles_follows', 'f')
          .where('f.follower_profile_id = :currentUserProfileId', {
            currentUserProfileId: currentUserProfile.id,
          })
          .andWhere('f.followed_profile_id = profile.id');
      }, 'profile_isFollowed');
    }

    return await queryBuilder.getMany();
  }

  async findFollow(
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

  async findByUsername(username: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: {
        username: username,
      },
    });

    if (!profile) throw new ProfileNotFoundException();

    return profile;
  }

  async getMyProfile(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id, deleted: false },
    });

    if (!profile) throw new ProfileNotFoundException(id);

    return profile;
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id, deleted: false },
    });

    if (!profile) throw new ProfileNotFoundException(id);

    return profile;
  }

  async findByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { userId, deleted: false },
    });

    if (!profile) throw new ProfileNotFoundException();

    return profile;
  }

  async getByUserId(userId: number): Promise<Profile | null> {
    const profile = await this.profileRepository.findOne({
      where: { userId, deleted: false },
    });

    return profile;
  }

  async update(userId: number, params: UpdateProfileParams): Promise<Profile> {
    const profile = await this.findByUserId(userId);

    try {
      if (params.username && params.username !== profile.username) {
        const existing = await this.profileRepository.findOne({
          where: { username: params.username },
        });
        if (existing) throw new UsernameAlreadyExistsException(params.username);
      }

      const updatePayload: Partial<Profile> = { ...params };

      Object.keys(updatePayload).forEach(
        (key) => updatePayload[key] === undefined && delete updatePayload[key],
      );

      if (params.birthday) {
        const date = new Date(params.birthday);
        updatePayload.birthday = isNaN(date.getTime()) ? null : date;
      }

      await this.profileRepository.update(profile.id, {
        ...updatePayload,
        updatedAt: new Date(),
      });

      return await this.findOne(profile.id);
    } catch (error: any) {
      if (error instanceof DomainException) throw error;
      throw new ProfileOperationException('update profile', error.message);
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    try {
      await this.profileRepository.update(id, { deleted: true });
    } catch (error: any) {
      throw new ProfileOperationException('delete profile', error.message);
    }
  }
}
