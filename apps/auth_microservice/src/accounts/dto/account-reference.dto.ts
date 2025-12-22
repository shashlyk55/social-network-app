import { Account } from 'src/entities/account.entity';

export class AccountReferenceDto {
  id: number;
  email: string;
  provider: string;
  providerId?: string;
  lastLoginAt?: Date;

  static toReference(entity: Account): AccountReferenceDto {
    const reference: AccountReferenceDto = {
      id: entity.id,
      email: entity.email,
      provider: entity.provider,
    };

    if (entity.providerId) {
      reference.providerId = entity.providerId;
    }

    if (entity.lastLoginAt) {
      reference.lastLoginAt = entity.lastLoginAt;
    }

    return reference;
  }
}
