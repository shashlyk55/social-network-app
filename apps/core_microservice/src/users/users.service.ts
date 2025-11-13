import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository, DataSource, FindOptionsWhere, ILike } from 'typeorm';
import bcrypt from 'bcrypt';
import { IUserService } from './interfaces/IUsersService';
import {
  CreateUserParams,
  FindAllUsersParams,
  FindAllUsersResult,
  UpdateUserParams,
} from './types/user-service.types';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create a new user with profile and account
   */
  async create(params: CreateUserParams): Promise<User> {
    const { name, email, bio, password } = params;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create({
        email,
        role: 'user',
      });

      const savedUser = await queryRunner.manager.save(user);

      const profile = this.profileRepository.create({
        name,
        bio,
        userId: savedUser.id,
      });

      await queryRunner.manager.save(profile);

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const account = this.accountRepository.create({
        passwordHash,
        userId: savedUser.id,
        provider: 'local',
      });

      await queryRunner.manager.save(account);

      await queryRunner.commitTransaction();

      return await this.findOne(savedUser.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create user: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find all users with pagination and filtering
   */
  async findAll(params: FindAllUsersParams): Promise<FindAllUsersResult> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = params;

    const where: FindOptionsWhere<User> = {};

    if (search) {
      where.email = ILike(`%${search}%`);
    }

    if (role) {
      where.role = role;
    }

    const [users, total] = await this.userRepository.findAndCount({
      where,
      relations: ['profile', 'account'],
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages: number = Math.ceil(total / limit);

    console.log(users);

    return { users, total, page, limit, totalPages };
  }

  /**
   * Find one user by ID
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile', 'account'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['profile', 'account'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  /**
   * Update user and profile
   */
  async update(userId: number, params: UpdateUserParams): Promise<User> {
    const user = await this.findOne(userId);
    const { ...updateData } = params;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (updateData.email && updateData.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateData.email },
        });

        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }

        await queryRunner.manager.update(User, userId, {
          email: updateData.email,
        });
      }

      const userUpdateData: Partial<User> = {};
      if (updateData.role) {
        userUpdateData.role = updateData.role;
      }

      if (Object.keys(userUpdateData).length > 0) {
        await queryRunner.manager.update(User, userId, userUpdateData);
      }

      const profileUpdateData: Partial<Profile> = {};
      if (updateData.name) {
        profileUpdateData.name = updateData.name;
      }
      if (updateData.bio !== undefined) {
        profileUpdateData.bio = updateData.bio;
      }
      if (updateData.avatarId !== undefined) {
        profileUpdateData.avatarId = updateData.avatarId;
      }

      if (Object.keys(profileUpdateData).length > 0) {
        await queryRunner.manager.update(
          Profile,
          { userId },
          profileUpdateData,
        );
      }

      await queryRunner.commitTransaction();

      return await this.findOne(userId);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to update user: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   *  Delete user
   */
  async remove(userId: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.userRepository.delete({ id: userId });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === '23503') {
        throw new BadRequestException(
          'Cannot delete user. There might be related records that prevent deletion. ' +
            'Please ensure all user data is properly handled before deletion.',
        );
      }

      throw new InternalServerErrorException(
        'Failed to delete user: ' + error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
