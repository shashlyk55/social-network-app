import { AccountReferenceDto } from 'src/accounts/dto/account-reference.dto';
import { Account } from 'src/entities/account.entity';
import { User } from 'src/entities/user.entity';

export class UserResponseDto {
  id: number;
  role: string;
  disabled: boolean;
  // createdAt: Date;
  // updatedAt: Date;
  // createdById?: number;
  // updatedById?: number;
  //account: AccountReferenceDto;

  static toResponse(user: User, account: Account): UserResponseDto {
    const dto = new UserResponseDto();
    Object.assign(dto, user);
    // dto.id = user.id;
    // dto.role = user.role;
    // dto.disabled = user.disabled;
    // dto.createdAt = user.createdAt;
    // dto.updatedAt = user.updatedAt;
    // dto.createdById = user.createdById;
    // dto.updatedById = user.updatedById;

    //dto.account = AccountReferenceDto.toReference(account);
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
