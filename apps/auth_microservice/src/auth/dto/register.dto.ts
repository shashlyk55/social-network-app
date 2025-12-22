import { AccountProviderType } from 'src/entities/account.entity';
import { UserRole } from 'src/entities/user.entity';
import { RegisterParams } from '../types/auth-params.types';

export class RegisterDto {
  email: string;
  password: string;
  role: UserRole;
  provider: AccountProviderType;
  providerId?: string;
  createdById?: number;

  static toRegisterParams(dto: RegisterDto): RegisterParams {
    const params: RegisterParams = {
      email: dto.email,
      password: dto.password,
      role: dto.role,
      provider: dto.provider,
    };
    if (dto.providerId) {
      params.providerId = dto.providerId;
    }

    if (dto.createdById) {
      params.createdById = dto.createdById;
    }

    return params;
  }
}
