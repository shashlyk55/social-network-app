import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUsersService } from './interfaces/IUsersService';
import {
  CreateUserParams,
  FindUsersParams,
  UserPaginationResult,
  UpdateUserParams,
} from './types/user-service.types';
import { Profile } from 'src/entities/profile.entity';
import { Account, AccountProviderType } from 'src/entities/account.entity';
import bcrypt from 'bcrypt';
import {
  EmailAlreadyExistsException,
  UsernameAlreadyExistsException,
  UserNotFoundException,
  UserOperationException,
} from './exceptions/user.exceptions';
import { DomainException } from 'src/app/exceptions/domain.exception';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  async create(params: CreateUserParams, createdById?: number): Promise<User> {
    const existingProfile = await this.profileRepository.findOne({
      where: { username: params.username },
    });

    if (existingProfile) {
      throw new UsernameAlreadyExistsException(params.username);
    }

    const existingAccount = await this.accountRepository.findOne({
      where: { email: params.email },
    });

    if (existingAccount) {
      throw new EmailAlreadyExistsException(params.email);
    }

    if (createdById !== undefined) {
      const createdByUser = await this.findOne(createdById);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create({
        role: params.role,
        disabled: params.disabled || false,
        createdById: createdById || undefined,
      });

      const savedUser = await queryRunner.manager.save(User, user);

      const profile = this.profileRepository.create({
        userId: savedUser.id,
        username: params.username,
        displayName: params.displayName,
        birthday: new Date(params.birthday),
        bio: params.bio,
        avatarUrl: params.avatarUrl,
        isPublic: params.isPublic !== undefined ? params.isPublic : true,
        createdById: savedUser.id,
      });

      await queryRunner.manager.save(Profile, profile);

      // TODO: move create account logic in Auth module
      const passwordHash = await bcrypt.hash(params.password, 10);
      const account = this.accountRepository.create({
        userId: savedUser.id,
        email: params.email,
        passwordHash,
        provider: AccountProviderType.LOCAL,
        createdById: savedUser.id,
      });

      await queryRunner.manager.save(Account, account);

      await queryRunner.commitTransaction();

      return await this.findOne(savedUser.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof DomainException) {
        throw error;
      }

      throw new UserOperationException('create user', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params: FindUsersParams): Promise<UserPaginationResult> {
    try {
      const { page = 1, limit = 10, role, disabled } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.createdBy', 'createdBy')
        .leftJoinAndSelect('user.updatedBy', 'updatedBy')
        .leftJoinAndSelect('user.account', 'account')
        //.leftJoinAndSelect('user.profile', 'profile')
        .where('user.disabled = :disabled', { disabled: false });

      if (role) {
        queryBuilder.andWhere('user.role = :role', { role });
      }

      if (disabled !== undefined) {
        queryBuilder.andWhere('user.disabled = :disabled', { disabled });
      }

      const [data, total] = await queryBuilder
        .skip(skip)
        .take(limit)
        .orderBy('user.createdAt', 'DESC')
        .getManyAndCount();

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new UserOperationException('find users', error.message);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: [
          'createdBy',
          'updatedBy',
          'account',
          //'profile'
        ],
      });

      if (!user) {
        throw new UserNotFoundException(id);
      }

      return user;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new UserOperationException('find user', error.message);
    }
  }

  async update(params: UpdateUserParams): Promise<User> {
    const { id, ...updateData } = params;

    const user = await this.findOne(id);

    if (params.updatedById !== undefined) {
      const updatedByUser = await this.findOne(params.updatedById);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userUpdatePayload: Partial<User> = {};
      if (updateData.role !== undefined)
        userUpdatePayload.role = updateData.role;
      if (updateData.disabled !== undefined)
        userUpdatePayload.disabled = updateData.disabled;
      if (updateData.updatedById !== undefined)
        userUpdatePayload.updatedById = updateData.updatedById;

      if (Object.keys(userUpdatePayload).length > 0) {
        await queryRunner.manager.update(User, id, userUpdatePayload);
      }

      if (
        updateData.username ||
        updateData.displayName ||
        updateData.birthday ||
        updateData.bio !== undefined ||
        updateData.avatarUrl !== undefined ||
        updateData.isPublic !== undefined
      ) {
        if (
          updateData.username &&
          updateData.username !== user.profile.username
        ) {
          const existingProfile = await this.profileRepository.findOne({
            where: { username: updateData.username },
          });

          if (existingProfile) {
            throw new UsernameAlreadyExistsException(updateData.username);
          }
        }

        const profileUpdatePayload: Partial<Profile> = {};
        if (updateData.username !== undefined)
          profileUpdatePayload.username = updateData.username;
        if (updateData.displayName !== undefined)
          profileUpdatePayload.displayName = updateData.displayName;
        if (updateData.birthday !== undefined)
          profileUpdatePayload.birthday = new Date(updateData.birthday);
        if (updateData.bio !== undefined)
          profileUpdatePayload.bio = updateData.bio;
        if (updateData.avatarUrl !== undefined)
          profileUpdatePayload.avatarUrl = updateData.avatarUrl;
        if (updateData.isPublic !== undefined)
          profileUpdatePayload.isPublic = updateData.isPublic;
        if (updateData.updatedById !== undefined)
          profileUpdatePayload.updatedById = updateData.updatedById;

        await queryRunner.manager.update(
          Profile,
          user.profile.id,
          profileUpdatePayload,
        );
      }

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof DomainException) {
        throw error;
      }

      throw new UserOperationException('update user', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(User, id);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new UserOperationException('remove user', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async softRemove(id: number, deletedById: number): Promise<void> {
    const user = await this.findOne(id);

    const deletedByUser = await this.findOne(deletedById);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, id, {
        disabled: true,
        updatedById: deletedById,
      });

      await queryRunner.manager.update(Profile, user.profile.id, {
        deleted: true,
        updatedById: deletedById,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new UserOperationException('soft remove user', error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async restore(id: number, restoredById: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new UserNotFoundException(id);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, id, {
        disabled: false,
        updatedById: restoredById,
      });

      await queryRunner.manager.update(Profile, user.profile.id, {
        deleted: false,
        updatedById: restoredById,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new UserOperationException('restore user', error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
