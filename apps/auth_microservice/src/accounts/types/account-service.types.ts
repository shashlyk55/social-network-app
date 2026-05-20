import { Account, AccountProviderType } from 'src/entities/account.entity';

export type CreateAccountParams = {
  userId: number;
  email: string;
  password: string;
  provider: AccountProviderType;
  createdById?: number;
};

export type CreateOAuthAccountParams = {
  userId: number;
  email: string;
  provider: AccountProviderType;
  providerId?: string;
  createdById?: number;
};

export type FindAccountsParams = {
  page?: number;
  limit?: number;
};

export type UpdateAccountParams = {};

export type AccountResult = Pick<Account, 'email' | 'lastLoginAt'>;
