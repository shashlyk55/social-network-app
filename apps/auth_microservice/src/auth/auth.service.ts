import { IAccountsService } from 'src/accounts/interfaces/IAccountsService';
import { IUsersService } from 'src/users/interfaces/IUsersService';
import { IAuthService } from './interfaces/IAuthService';
import {
  RefreshTokenParams,
  ValidateTokenParams,
  RegisterParams,
  TokenResult,
  AuthResult,
  LoginParams,
  TokenPayload,
} from './types/auth-params.types';
import { DataSource } from 'typeorm';
import { UserRole } from 'src/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import {
  AuthOperationException,
  InvalidCredentials,
} from './exceptions/auth.exceptions';
import { AccountProviderType } from '../entities/account.entity';
import { DomainException } from '../common/exceptions/domain.excpetion';
import bcrypt from 'bcryptjs';

export class AuthService implements IAuthService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly accountsService: IAccountsService,
    private readonly usersService: IUsersService,
    private readonly dataSource: DataSource,
  ) {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-secren';
    this.accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';
    this.refreshTokenSecret =
      process.env.REFRESH_TOKEN_SECRET || 'refresh-secren';
    this.refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  }
  async registerUser(params: RegisterParams): Promise<AuthResult> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      try {
        const user = await this.usersService.create(
          {
            role: params.role,
          },
          undefined,
          transactionalEntityManager,
        );

        const account = await this.accountsService.create(
          {
            userId: user.id,
            email: params.email,
            password: params.password,
            provider: params.provider || AccountProviderType.LOCAL,
            createdById: params.createdById,
            providerId: params.providerId,
          },
          transactionalEntityManager,
        );

        const generateTokensParams = { userId: user.id, role: user.role };
        const tokens = this.generateTokens(generateTokensParams);

        return {
          user,
          account,
          tokens,
        };
      } catch (error) {
        if (error instanceof DomainException) {
          throw error;
        }

        throw new AuthOperationException('register user', error);
      }
    });
  }

  async authenticateUser(credentials: LoginParams): Promise<TokenResult> {
    try {
      const { email, password } = credentials;

      const passwordHash =
        await this.accountsService.getAccountPasswordByEmail(email);

      if (!passwordHash) {
        throw new InvalidCredentials();
      }

      const isPasswordValid = await bcrypt.compare(password, passwordHash);

      if (!isPasswordValid) {
        throw new InvalidCredentials();
      }

      const user = await this.usersService.findByEmail(email);

      const generateTokensParams = { userId: user.id, role: user.role };
      const tokens = this.generateTokens(generateTokensParams);

      // TODO: create session

      return tokens;
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        throw error;
      }

      throw new AuthOperationException('authenticate user', error.message);
    }
  }

  /**
   * Validates the old_refresh_token_id(old token) in Redis and generates a new pair of tokens.
   */
  processRefreshToken(old_refresh_token_id: RefreshTokenParams) {
    throw new Error('Method not implemented.');
  }

  /**
   * Checks the signature, expiration, and blacklist status of an access_token.
   */
  validateToken(params: ValidateTokenParams) {
    throw new Error('Method not implemented.');
  }

  /**
   * Exchanges the code for a user profile, finds/creates the user, and calls generateNewTokens.
   */
  exchageCodeForTokens(code: any) {
    throw new Error('Method not implemented.');
  }

  private generateTokens(params: TokenPayload): TokenResult {
    const accessTokenExpiresIn = this.parseExpiresIn(this.accessTokenExpiresIn);
    const accessToken = jwt.sign(params, this.accessTokenSecret, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshTokenExpiresIn = this.parseExpiresIn(
      this.refreshTokenExpiresIn,
    );
    const refreshToken = jwt.sign(params, this.refreshTokenSecret, {
      expiresIn: refreshTokenExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 3600;
    }
  }
}
