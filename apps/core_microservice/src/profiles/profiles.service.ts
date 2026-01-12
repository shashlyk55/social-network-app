import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { IProfilesService } from './interfaces/IProfilesService';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainException } from 'src/app/exceptions/domain.exception';
import { Profile } from 'src/entities/profile.entity';
import { Repository, DataSource } from 'typeorm';
import {
  UsernameAlreadyExistsException,
  ProfileOperationException,
  ProfileNotFoundException,
} from './exceptions/profile.exceptions';
import {
  CreateProfileParams,
  UpdateProfileParams,
} from './types/profile-params.types';

@Injectable()
export class ProfilesService implements IProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly dataSource: DataSource,
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
    } catch (error) {
      if (error instanceof DomainException) throw error;
      throw new ProfileOperationException('create profile', error.message);
    }
  }

  async findOne(id: number): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id, deleted: false },
      });

      if (!profile) throw new ProfileNotFoundException(id);

      return profile;
    } catch (error) {
      if (error instanceof ProfileNotFoundException) throw error;
      throw new ProfileOperationException('find profile', error.message);
    }
  }

  async findByUserId(userId: number): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findOne({
        where: { userId, deleted: false },
      });

      if (!profile) throw new ProfileNotFoundException();

      return profile;
    } catch (error) {
      if (error instanceof ProfileNotFoundException) throw error;
      throw new ProfileOperationException('find profile', error.message);
    }
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

      await this.profileRepository.update(profile.id, {
        ...updatePayload,
        updatedAt: new Date(),
      });

      return await this.findOne(profile.id);
    } catch (error) {
      if (error instanceof DomainException) throw error;
      throw new ProfileOperationException('update profile', error.message);
    }
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);

    try {
      await this.profileRepository.update(id, { deleted: true });
    } catch (error) {
      throw new ProfileOperationException('delete profile', error.message);
    }
  }
}
