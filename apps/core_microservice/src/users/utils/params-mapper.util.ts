import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

import {
  CreateUserParams,
  UpdateUserParams,
  UserPaginationResult,
} from '../types/user-service.types';
import { User } from 'src/entities/user.entity';

export class UserMappers {
  static toCreateParams(dto: CreateUserDto): CreateUserParams {
    return {
      role: dto.role,
      disabled: dto.disabled || false,
      // createdById: dto.createdById || undefined,
      // Profile data
      username: dto.username,
      displayName: dto.displayName,
      birthday: dto.birthday,
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      isPublic: dto.isPublic !== undefined ? dto.isPublic : true,
      // Account data
      email: dto.email,
      password: dto.password,
    };
  }

  static toUpdateParams(id: number, dto: UpdateUserDto): UpdateUserParams {
    return {
      id,
      role: dto.role,
      disabled: dto.disabled,
      updatedById: dto.updatedById,
      // Profile data
      username: dto.username,
      displayName: dto.displayName,
      birthday: dto.birthday,
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      isPublic: dto.isPublic,
    };
  }

  static toResponse(user: User): UserResponseDto {
    const response: UserResponseDto = {
      id: user.id,
      role: user.role,
      disabled: user.disabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdById: user.createdById,
      updatedById: user.updatedById,
    };

    if (user.createdBy) {
      response.createdBy = {
        id: user.createdBy.id,
        role: user.createdBy.role,
      };
    }

    if (user.updatedBy) {
      response.updatedBy = {
        id: user.updatedBy.id,
        role: user.updatedBy.role,
      };
    }

    // Add profile data to response
    if (user.profile) {
      response.profile = {
        id: user.profile.id,
        username: user.profile.username,
        displayName: user.profile.displayName,
        birthday: user.profile.birthday,
        bio: user.profile.bio,
        avatarUrl: user.profile.avatarUrl,
        isPublic: user.profile.isPublic,
        createdAt: user.profile.createdAt,
      };
    }

    // Add account data to response
    if (user.account) {
      response.account = {
        id: user.account.id,
        email: user.account.email,
        provider: user.account.provider,
        lastLoginAt: user.account.lastLoginAt,
      };
    }

    return response;
  }

  static toPaginationResponse(
    result: UserPaginationResult,
  ): PaginationResponseDto<UserResponseDto> {
    return {
      data: result.data.map((user) => this.toResponse(user)),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}
