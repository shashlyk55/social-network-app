import { AccountProviderType } from 'src/entities/account.entity';
import { CreateAccountParams } from '../types/account-service.types';

export class CreateAccountDto {
  userId: number;
  email: string;
  password: string;
  provider: AccountProviderType;

  constructor(data: Partial<CreateAccountDto>) {
    Object.assign(this, data);
  }

  static toCreateParams(
    dto: CreateAccountDto,
    createdById: number,
  ): CreateAccountParams {
    const params: CreateAccountParams = {
      userId: dto.userId,
      email: dto.email,
      password: dto.password,
      provider: dto.provider,
      createdById: createdById,
    };
    return params;
  }
}
