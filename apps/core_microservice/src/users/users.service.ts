import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository, DataSource, FindOptionsWhere, ILike } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
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
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create({
        email: createUserDto.email,
        role: 'user',
      });

      const savedUser = await queryRunner.manager.save(user);

      const profile = this.profileRepository.create({
        name: createUserDto.name,
        bio: createUserDto.bio,
        userId: savedUser.id,
      });

      await queryRunner.manager.save(profile);

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

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
  async findAll(query: any): Promise<{ users: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      role,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

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

    return { users, total };
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
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });

        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }

        await queryRunner.manager.update(User, id, {
          email: updateUserDto.email,
        });
      }

      const userUpdateData: Partial<User> = {};
      if (updateUserDto.role) {
        userUpdateData.role = updateUserDto.role;
      }

      if (Object.keys(userUpdateData).length > 0) {
        await queryRunner.manager.update(User, id, userUpdateData);
      }

      const profileUpdateData: Partial<Profile> = {};
      if (updateUserDto.name) {
        profileUpdateData.name = updateUserDto.name;
      }
      if (updateUserDto.bio !== undefined) {
        profileUpdateData.bio = updateUserDto.bio;
      }
      if (updateUserDto.avatarId !== undefined) {
        profileUpdateData.avatarId = updateUserDto.avatarId;
      }

      if (Object.keys(profileUpdateData).length > 0) {
        await queryRunner.manager.update(
          Profile,
          { userId: id },
          profileUpdateData,
        );
      }

      await queryRunner.commitTransaction();

      return await this.findOne(id);
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
   * Soft delete user (deactivate)
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    try {
      await this.userRepository.delete({ id });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete user: ' + error.message,
      );
    }
  }
}
