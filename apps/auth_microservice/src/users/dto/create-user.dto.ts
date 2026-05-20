import { UserRole } from 'src/entities/user.entity';

export class CreateUserDto {
  role: UserRole;

  constructor(params: { role: UserRole }) {
    Object.assign(this, params);
  }

  static toCreaeteParams(dto: CreateUserDto): CreateUserDto {
    const params: CreateUserDto = {
      role: dto.role,
    };

    return params;
  }
}
