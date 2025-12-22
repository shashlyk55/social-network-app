import { Account } from 'src/entities/account.entity';
import {
  AccountResult,
  CreateAccountParams,
} from '../types/account-service.types';
import {
  AuthResult,
  ValidatePasswordResult,
} from 'src/auth/types/auth-params.types';
import { EntityManager } from 'typeorm';

export interface IAccountsService {
  create(
    params: CreateAccountParams,
    transactionalEntityManager?: EntityManager,
  ): Promise<AccountResult>;
  findOneByUserId(id: number): Promise<AccountResult>;
  findOneByAccountId(id: number): Promise<AccountResult>;
  getAccountPasswordByEmail(email: string): Promise<string | undefined>;
  findAll(): Promise<AccountResult[]>;
  remove(id: number): Promise<void>;
  updateLastLogin(
    accountId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<void>;
  // validatePassword(
  //   email: string,
  //   passowrd: string,
  // ): Promise<ValidatePasswordResult>;
}
