import { User } from '../entities/user.entity';
import {
  UserOperationException,
  UserNotFoundException,
  UserDisabled,
} from './exceptions/user.exceptions';
import { IUsersService } from './interfaces/IUsersService';
import {
  CreateUserParams,
  FindUsersParams,
  UpdateUserParams,
  UserResult,
} from './types/user-service.types';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginationResult } from 'src/common/types/service.types';
import { DomainException } from '../common/exceptions/domain.exception';
import { AccountProviderType } from 'src/entities/account.entity';

export class UsersService implements IUsersService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    params: CreateUserParams,
    createdById?: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<User> {
    try {
      const manager = transactionalEntityManager || this.userRepository.manager;

      const user = manager.create(User, {
        role: params.role,
        createdById: createdById,
      });

      const savedUser = await manager.save(User, user);

      return savedUser;
    } catch (error: any) {
      throw new UserOperationException('create user', error);
    }
  }

  async findAll(
    params: FindUsersParams,
  ): Promise<PaginationResult<UserResult>> {
    const { page = 1, limit = 10, role, disabled } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.account', 'account')
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
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<UserResult> {
    let user;
    try {
      user = await this.userRepository.findOne({
        where: { id },
      });
    } catch (error: any) {
      throw new UserOperationException('find user', error);
    }
    if (!user) {
      throw new UserNotFoundException(id);
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserResult> {
    let user;
    try {
      user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.account', 'account')
        .select([
          'user.id',
          'user.role',
          'user.disabled',
          'account.email',
          'account.lastLoginAt',
          'account.provider',
        ])
        .where('account.email = :email', { email })
        .getOne();
    } catch (error: any) {
      throw new UserOperationException('find user by email', error);
    }

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  /**
   * Find user by email and provider before OAuth authentification. If user not found, return null.
   */
  async findByEmailAndProvider(
    email: string,
    provider: AccountProviderType,
  ): Promise<UserResult | null> {
    let user;
    try {
      user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.account', 'account')
        .select([
          'user.id',
          'user.role',
          'account.email',
          'account.lastLoginAt',
          'account.provider',
        ])
        .where('account.email = :email AND account.provider = :provider', {
          email,
          provider,
        })
        .getOne();
    } catch (error: any) {
      throw new UserOperationException(
        'find user by email and provider',
        error,
      );
    }
    if (!user) {
      return null;
    }

    return user;
  }

  async update(params: UpdateUserParams): Promise<UserResult> {
    const { id, ...updateData } = params;

    await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userUpdatePayload: Partial<User> = {};
      if (updateData.role !== undefined)
        userUpdatePayload.role = updateData.role;
      if (updateData.updatedById !== undefined)
        userUpdatePayload.updatedById = updateData.updatedById;

      if (Object.keys(userUpdatePayload).length > 0) {
        await queryRunner.manager.update(User, id, userUpdatePayload);
      }

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      if (error instanceof DomainException) {
        throw error;
      }

      throw new UserOperationException('update user', error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    try {
      await this.userRepository.delete(id);
    } catch (error: any) {
      throw new UserOperationException('remove user', error);
    }
  }

  async softRemove(id: number, deletedById: number): Promise<void> {
    await this.findOne(id);

    try {
      await this.userRepository.update(id, {
        disabled: true,
        updatedById: deletedById,
      });
    } catch (error: any) {
      throw new UserOperationException('soft remove user', error);
    }
  }

  async restore(id: number, restoredById: number) {
    await this.findOne(id);

    try {
      await this.userRepository.update(id, {
        disabled: false,
        updatedById: restoredById,
      });
    } catch (error: any) {
      throw new UserOperationException('restore user', error);
    }
  }

  async isUserDisabled(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user.disabled) {
      throw new UserDisabled();
    }
  }
}
