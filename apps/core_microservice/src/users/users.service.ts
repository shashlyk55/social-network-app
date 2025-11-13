import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserService } from './interfaces/IUsersService';
import {
  CreateUserParams,
  FindUsersParams,
  UserPaginationResult,
  UpdateUserParams,
} from './types/user-service.types';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(params: CreateUserParams): Promise<User> {
    const user = this.userRepository.create({
      role: params.role,
      disabled: params.disabled || false,
      createdById: params.createdById,
    });

    return await this.userRepository.save(user);
  }

  async findAll(params: FindUsersParams): Promise<UserPaginationResult> {
    const { page = 1, limit = 10, role, disabled } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.createdBy', 'createdBy')
      .leftJoinAndSelect('user.updatedBy', 'updatedBy')
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
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['createdBy', 'updatedBy'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(params: UpdateUserParams): Promise<User> {
    const { id, ...updateData } = params;

    await this.findOne(id);

    const updatePayload: Partial<User> = {};
    if (updateData.role !== undefined) updatePayload.role = updateData.role;
    if (updateData.disabled !== undefined)
      updatePayload.disabled = updateData.disabled;
    if (updateData.updatedById !== undefined)
      updatePayload.updatedById = updateData.updatedById;

    await this.userRepository.update(id, updatePayload);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async softRemove(id: number, deletedById: number): Promise<void> {
    await this.findOne(id);

    await this.userRepository.update(id, {
      disabled: true,
      updatedById: deletedById,
    });
  }
}
