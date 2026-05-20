import { Account, AccountProviderType } from '../entities/account.entity';
import { IAccountsService } from './interfaces/IAccountsService';
import {
  AccountResult,
  CreateAccountParams,
  CreateOAuthAccountParams,
  FindAccountsParams,
} from './types/account-service.types';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  AccountNotFoundException,
  AccountOperationException,
  EmailAlreadyExistsException,
} from './exceptions/account.exceptions';
import bcrypt from 'bcryptjs';
import { DomainException } from '../common/exceptions/domain.exception';
import { PaginationResult } from 'src/common/types/service.types';
import { ConfigService } from 'src/config/config.service';

export class AccountsService implements IAccountsService {
  constructor(
    private readonly accountRepository: Repository<Account>,
    private readonly configService: ConfigService,
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

      const salt = this.configService.getNumber('BCRYPT_SALT_ROUNDS', 10);
      const passwordHash = await bcrypt.hash(params.password, salt);

      const account = manager.create(Account, {
        email: params.email,
        createdById: params.userId,
        passwordHash: passwordHash,
        provider: params.provider,
        userId: params.userId,
        lastLoginAt: new Date(),
      });

      const savedAccount = await manager.save(Account, account);

      return savedAccount;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AccountOperationException('create account', error);
    }
  }

  async createWithOAuth(
    params: CreateOAuthAccountParams,
    transactionalEntityManager?: EntityManager,
  ) {
    try {
      const manager =
        transactionalEntityManager || this.accountRepository.manager;

      const existing = await manager
        .createQueryBuilder(Account, 'account')
        .where('account.email = :email', { email: params.email })
        .andWhere('account.provider = :provider', {
          provider: params.provider,
        })
        .getOne();

      if (existing) {
        return existing;
      }

      const account = manager.create(Account, {
        email: params.email,
        userId: params.userId,
        provider: params.provider,
        providerId: params.providerId,
        createdById: params.userId,
        lastLoginAt: new Date(),
        passwordHash: null,
      });

      return await manager.save(Account, account);
    } catch (error) {
      throw new AccountOperationException('create account', error);
    }
  }

  async findOneByUserId(id: number): Promise<AccountResult> {
    let account;
    try {
      account = await this.accountRepository
        .createQueryBuilder('account')
        .select(['account.id', 'account.email', 'account.lastLoginAt'])
        .where('account.userId = :userId', { userId: id })
        .getOne();
    } catch (error) {
      throw new AccountOperationException('find account by user id', error);
    }

    if (!account) {
      throw new AccountNotFoundException();
    }

    return account;
  }

  async findOneByAccountId(id: number): Promise<AccountResult> {
    let account;
    try {
      account = await this.accountRepository
        .createQueryBuilder('account')
        .select(['account.id', 'account.email', 'account.lastLoginAt'])
        .where('account.id = :accountId', { accountId: id })
        .getOne();
    } catch (error) {
      throw new AccountOperationException('find account by user id', error);
    }
    if (!account) {
      throw new AccountNotFoundException(id);
    }

    return account;
  }

  async findAll(
    params: FindAccountsParams,
  ): Promise<PaginationResult<AccountResult>> {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.accountRepository.createQueryBuilder('account');

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('account.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async remove(id: number): Promise<void> {
    await this.findOneByAccountId(id);

    try {
      await this.accountRepository.delete(id);
    } catch (error) {
      throw new AccountOperationException('remove account', error);
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
      throw new AccountOperationException('update last login at', error);
    }
  }

  async getAccountPasswordByEmail(email: string): Promise<string> {
    try {
      const result = await this.accountRepository
        .createQueryBuilder('account')
        .select('account.passwordHash', 'passwordHash')
        .where('account.email = :email', { email })
        .andWhere('account.provider = :provider', {
          provider: AccountProviderType.LOCAL,
        })
        .getRawOne<{ passwordHash: string }>();

      if (!result) {
        throw new AccountNotFoundException();
      }

      return result.passwordHash;
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }
      throw new AccountOperationException('get account passowrd', error);
    }
  }
}
