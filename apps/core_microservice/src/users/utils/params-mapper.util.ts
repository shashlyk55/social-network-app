// src/users/utils/mappers.ts
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import {
  PaginationResponseDto,
  PaginationMetaDto,
} from '../dto/pagination-response.dto';
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
      createdById: dto.createdById,
    };
  }

  static toUpdateParams(id: number, dto: UpdateUserDto): UpdateUserParams {
    return {
      id,
      role: dto.role,
      disabled: dto.disabled,
      updatedById: dto.updatedById,
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
