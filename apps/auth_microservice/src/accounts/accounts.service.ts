import { Account } from '../entities/account.entity';
import { IAccountsService } from './interfaces/IAccountsService';
import {
  AccountResult,
  CreateAccountParams,
} from './types/account-service.types';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  AccountNotFoundException,
  AccountOperationException,
  EmailAlreadyExistsException,
} from './exceptions/account.exceptions';
import bcrypt from 'bcryptjs';
import {
  AuthResult,
  ValidatePasswordResult,
} from 'src/auth/types/auth-params.types';
import { DomainException } from '../common/exceptions/domain.excpetion';

export class AccountsService implements IAccountsService {
  constructor(
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    params: CreateAccountParams,
    transactionalEntityManager?: EntityManager,
  ): Promise<AccountResult> {
    try {
      const manager =
        transactionalEntityManager || this.accountRepository.manager;

      const existingAccount = await manager.findOne(Account, {
        where: { email: params.email },
      });

      if (existingAccount) {
        throw new EmailAlreadyExistsException(params.email);
      }

      const salt = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

      const passwordHash = await bcrypt.hash(params.password, salt);

      console.log(params);

      const account = manager.create(Account, {
        email: params.email,
        createdById: params.userId,
        passwordHash: passwordHash,
        provider: params.provider,
        userId: params.userId,
        providerId: params.providerId,
        lastLoginAt: new Date(),
      });

      const savedAccount = await manager.save(Account, account);

      return savedAccount;
    } catch (error) {
      //console.error(error);

      if (error instanceof DomainException) {
        throw error;
      }

      throw new AccountOperationException('create account', error.message);
    }
  }

  async findOneByUserId(id: number): Promise<Account> {
    try {
      const account = await this.accountRepository.findOne({
        where: { userId: id },
      });

      if (!account) {
        throw new AccountNotFoundException();
      }

      return account;
    } catch (error) {
      if (error instanceof AccountNotFoundException) {
        throw error;
      }
      throw new AccountOperationException(
        'find account by user id',
        error.message,
      );
    }
  }

  async findOneByAccountId(id: number): Promise<Account> {
    try {
      const account = await this.accountRepository.findOne({
        where: { id },
      });

      if (!account) {
        throw new AccountNotFoundException(id);
      }

      return account;
    } catch (error) {
      if (error instanceof AccountNotFoundException) {
        throw error;
      }
      throw new AccountOperationException(
        'find account by user id',
        error.message,
      );
    }
  }

  async findAll(): Promise<Account[]> {
    try {
      const accounts = await this.accountRepository.find();

      return accounts;
    } catch (error) {
      throw new AccountOperationException('find accounts', error.message);
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOneByAccountId(id);

    try {
      await this.accountRepository.delete(id);
    } catch (error) {
      throw new AccountOperationException('delete account', error.message);
    }
  }

  async updateLastLogin(
    accountId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<void> {
    await this.findOneByAccountId(accountId);
    try {
      const manager =
        transactionalEntityManager || this.accountRepository.manager;

      await manager.update(Account, accountId, {
        lastLoginAt: new Date(),
      });
    } catch (error) {
      throw new AccountOperationException('set last login at', error.message);
    }
  }

  async getAccountPasswordByEmail(email: string): Promise<string | undefined> {
    try {
      const account = await this.accountRepository.findOne({
        select: ['passwordHash'],
        where: { email },
      });

      return account?.passwordHash;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AccountOperationException('validate passowrd', error.message);
    }
  }
}
