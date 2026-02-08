import { User } from 'src/entities/user.entity';

export class UserResponseDto {
  id: number;
  role: string;
  disabled: boolean;

  static toResponse(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    Object.assign(dto, user);

    return dto;
  }
}

export class UserPaginationDto {
  data: UserResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  static create(params: {
    data: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
  }): UserPaginationDto {
    const dto = new UserPaginationDto();
    dto.data = params.data;
    dto.total = params.total;
    dto.page = params.page;
    dto.limit = params.limit;
    dto.totalPages = Math.ceil(params.total / params.limit);
    return dto;
  }
}
