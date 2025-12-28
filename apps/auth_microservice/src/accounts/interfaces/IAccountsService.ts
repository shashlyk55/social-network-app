import {
  AccountResult,
  CreateAccountParams,
} from '../types/account-service.types';

import { EntityManager } from 'typeorm';

export interface IAccountsService {
  create(
    params: CreateAccountParams,
    transactionalEntityManager?: EntityManager,
  ): Promise<AccountResult>;
  createWithOAuth(params, transactionalEntityManager?: EntityManager);
  findOneByUserId(id: number): Promise<AccountResult>;
  findOneByAccountId(id: number): Promise<AccountResult>;
  getAccountPasswordByEmail(email: string): Promise<string | null>;
  findAll(): Promise<AccountResult[]>;
  remove(id: number): Promise<void>;
  updateLastLogin(
    accountId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<void>;
}
