import { User, UserRole } from '../entities/user.entity';
import {
  UserOperationException,
  UserNotFoundException,
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
import { DomainException } from '../common/exceptions/domain.excpetion';

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
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new UserOperationException('create user', error.message);
    }
  }

  async findAll(
    params: FindUsersParams,
  ): Promise<PaginationResult<UserResult>> {
    try {
      const { page = 1, limit = 10, role, disabled } = params;
      const skip = (page - 1) * limit;

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        // .leftJoinAndSelect('user.createdBy', 'createdBy')
        // .leftJoinAndSelect('user.updatedBy', 'updatedBy')
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
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      throw new UserOperationException('find users', error.message);
    }
  }

  async findOne(id: number): Promise<UserResult> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: [
          // 'createdBy',
          // 'updatedBy',
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

  async findByEmail(email: string): Promise<UserResult> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.account', 'account')
        .select([
          'user.id',
          'user.role',
          'account.email',
          'account.lastLoginAt',
        ])
        .where('account.email = :email', { email })
        .getOne();

      if (!user) {
        throw new UserNotFoundException();
      }

      return user;
    } catch (error) {
      throw new UserOperationException('find user by email', error.message);
    }
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
    await this.findOne(id);

    try {
      await this.userRepository.delete(id);
    } catch (error) {
      throw new UserOperationException('remove user', error.message);
    }
  }

  async softRemove(id: number, deletedById: number): Promise<void> {
    await this.findOne(id);

    try {
      await this.userRepository.update(id, {
        disabled: true,
        updatedById: deletedById,
      });
    } catch (error) {
      throw new UserOperationException('soft remove user', error.message);
    }
  }

  async restore(id: number, restoredById: number) {
    await this.findOne(id);

    try {
      await this.userRepository.update(id, {
        disabled: false,
        updatedById: restoredById,
      });
    } catch (error) {
      throw new UserOperationException('restore user', error.message);
    }
  }
}
