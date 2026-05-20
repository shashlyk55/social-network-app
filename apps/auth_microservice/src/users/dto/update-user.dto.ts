import { UserRole } from 'src/entities/user.entity';

export class UpdateUserDto {
  role?: UserRole;
  disabled?: boolean;

  constructor(params: { role?: UserRole; disabled?: boolean }) {
    Object.assign(this, params);
  }

  static fromRequest(params: {
    role?: UserRole;
    disabled?: boolean;
  }): UpdateUserDto {
    return new UpdateUserDto(params);
  }
}
