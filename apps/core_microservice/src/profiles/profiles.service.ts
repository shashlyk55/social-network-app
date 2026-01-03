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
        relations: ['posts', 'followers', 'following'],
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
        relations: ['posts', 'followers', 'following'],
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
      relations: ['posts', 'followers', 'following'],
    });

    return profile;
  }

  async update(id: number, params: UpdateProfileParams): Promise<Profile> {
    const profile = await this.findOne(id);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // TODO: add updating user email

    try {
      if (params.username && params.username !== profile.username) {
        const existing = await queryRunner.manager.findOne(Profile, {
          where: { username: params.username },
        });
        if (existing) throw new UsernameAlreadyExistsException(params.username);
      }

      await queryRunner.manager.update(Profile, id, {
        ...params,
        updatedAt: new Date(),
      });

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof DomainException) throw error;
      throw new ProfileOperationException('update profile', error.message);
    } finally {
      await queryRunner.release();
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
