import { User, UserRole } from 'src/entities/user.entity';

export class UserReferenceDto {
  id: number;
  role: UserRole;
  disabled: boolean;
  accountId: number;
  createdById: number;
  updatedById?: number;
  createdAt: Date;
  updatedAt?: Date;

  static toReference(entity: User): UserReferenceDto {
    const reference: UserReferenceDto = {
      id: entity.id,
      role: entity.role,
      disabled: entity.disabled,
      accountId: entity.accountId,
      createdById: entity.createdById,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    return reference;
  }
}
