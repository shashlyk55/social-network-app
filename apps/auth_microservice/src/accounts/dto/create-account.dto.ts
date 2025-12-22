import { AccountProviderType } from 'src/entities/account.entity';
import { CreateAccountParams } from '../types/account-service.types';
import { AccountReferenceDto } from './account-reference.dto';

export class CreateAccountDto {
  userId: number;
  email: string;
  password: string;
  provider: AccountProviderType;
  providerId?: string;

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
      providerId: dto.providerId,
      createdById: createdById,
    };
    return params;
  }
}
