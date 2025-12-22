import { Account, AccountProviderType } from 'src/entities/account.entity';

export type CreateAccountParams = {
  userId: number;
  email: string;
  password: string;
  provider: AccountProviderType;
  providerId?: string;
  createdById?: number;
};

export type UpdateAccountParams = {};

export type AccountResult = Omit<
  Account,
  'passwordHash' | 'user' | 'createdBy' | 'updatedBy'
>;
