import { Account, AccountProviderType } from '../entities/account.entity';
import { IAccountsService } from './interfaces/IAccountsService';
import {
  AccountResult,
  CreateAccountParams,
  CreateOAuthAccountParams,
} from './types/account-service.types';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  AccountNotFoundException,
  AccountOperationException,
  EmailAlreadyExistsException,
} from './exceptions/account.exceptions';
import bcrypt from 'bcryptjs';
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
        where: { email: params.email, provider: AccountProviderType.LOCAL },
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
        //providerId: params.providerId,
        lastLoginAt: new Date(),
      });

      const savedAccount = await manager.save(Account, account);

      return savedAccount;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AccountOperationException('create account', error.message);
    }
  }

  async createWithOAuth(
    params: CreateOAuthAccountParams,
    transactionalEntityManager?: EntityManager,
  ) {
    try {
      const manager =
        transactionalEntityManager || this.accountRepository.manager;

      // 9. Проверка: не занят ли email другим LOCAL или OAuth аккаунтом
      // Важно: в OAuth обычно проверяют связку email + provider
      // const existing = await manager.findOne(Account, {
      //   where: { email: params.email, provider: params.provider },
      // });
      const existing = await manager
        .createQueryBuilder(Account, 'account')
        .where('account.email = :email', { email: params.email })
        .andWhere('account.provider = :provider', {
          provider: params.provider,
        })
        .getOne();

      console.log(existing);

      if (existing) {
        return existing; // Или бросаем ошибку, если логика требует уникальности
      }

      // 12. Создание записи аккаунта (Шаг 12 на схеме)
      const account = manager.create(Account, {
        email: params.email,
        userId: params.userId,
        provider: params.provider,
        providerId: params.providerId,
        createdById: params.userId,
        lastLoginAt: new Date(),
        passwordHash: null,
        // email: params.email,
        // userId: params.userId,
        // provider: params.provider,
        // providerId: params.providerId,
        // createdById: null,
        // lastLoginAt: new Date(),
        // passwordHash: null,

        // email: params.email,
        // createdById: params.userId,
        // passwordHash: passwordHash,
        // provider: params.provider,
        // userId: params.userId,
        // lastLoginAt: new Date(),
      });

      return await manager.save(Account, account);
    } catch (error) {
      throw new AccountOperationException('create account', error.message);
    }
  }

  async findOneByUserId(id: number): Promise<AccountResult> {
    try {
      const account = await this.accountRepository
        .createQueryBuilder('account')
        .select(['account.id', 'account.email', 'account.lastLoginAt'])
        .where('account.userId = :userId', { userId: id })
        .getOne();

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

  async findOneByAccountId(id: number): Promise<AccountResult> {
    try {
      const account = await this.accountRepository
        .createQueryBuilder('account')
        .select(['account.id', 'account.email', 'account.lastLoginAt'])
        .where('account.id = :accountId', { accountId: id })
        .getOne();

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

  async findAll(): Promise<AccountResult[]> {
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

  async getAccountPasswordByEmail(email: string): Promise<string | null> {
    try {
      const account = await this.accountRepository.findOne({
        select: ['passwordHash'],
        where: { email },
      });

      if (!account) {
        throw new AccountNotFoundException();
      }

      return account.passwordHash;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AccountOperationException('validate passowrd', error.message);
    }
  }
}
