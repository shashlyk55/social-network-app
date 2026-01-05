import { IAccountsService } from '../accounts/interfaces/IAccountsService';
import { IUsersService } from '../users/interfaces/IUsersService';
import { IAuthService } from './interfaces/IAuthService';
import {
  RegisterParams,
  TokenResult,
  AuthResult,
  LoginParams,
  TokenPayload,
  LogoutParams,
  ValidateTokenResult,
  TokenDecodeResult,
  OAuthResult,
} from './types/auth-params.types';
import { DataSource } from 'typeorm';
import { UserRole } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import {
  AccessTokenInBlacklist,
  AuthOperationException,
  InvalidCredentials,
  RefreshTokenInBlacklist,
  SessionNotFound,
} from './exceptions/auth.exceptions';
import { AccountProviderType } from '../entities/account.entity';
import { DomainException } from '../common/exceptions/domain.exception';
import bcrypt from 'bcryptjs';
import { IRedisRepository } from './interfaces/IRedisRepository';
import { v4 as uuidv4 } from 'uuid';
import { IExternalAuthService } from './interfaces/IExternalAuthService';
import { AccountNotFoundException } from '../accounts/exceptions/account.exceptions';
import { ConfigService } from 'src/config/config.service';

export class AuthService implements IAuthService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresIn: string;
  private readonly refreshTokenBlacklistTTL = 1000 * 60;

  constructor(
    private readonly accountsService: IAccountsService,
    private readonly usersService: IUsersService,
    private readonly dataSource: DataSource,
    private readonly redisRepository: IRedisRepository,
    private readonly externalAuthService: IExternalAuthService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.get(
      'ACCESS_TOKEN_SECRET',
      'access-secret',
    );
    this.accessTokenExpiresIn = this.configService.get(
      'ACCESS_TOKEN_EXPIRES_IN',
      '1h',
    );
    this.refreshTokenSecret = this.configService.get(
      'REFRESH_TOKEN_SECRET',
      'refresh-secret',
    );
    this.refreshTokenExpiresIn = this.configService.get(
      'REFRESH_TOKEN_EXPIRES_IN',
      '7d',
    );
  }

  /**
   * Exchanges the code for a user profile, finds/creates the user, and calls generateNewTokens.
   */
  async exchageCodeForTokens(
    code: string,
    provider: AccountProviderType,
  ): Promise<OAuthResult> {
    const profile = await this.externalAuthService.exchangeCodeForProfile(
      code,
      provider,
    );

    let user = await this.usersService.findByEmailAndProvider(
      profile.email,
      provider,
    );

    if (!user) {
      user = await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          try {
            const newUser = await this.usersService.create(
              {
                role: UserRole.USER,
              },
              undefined,
              transactionalEntityManager,
            );

            const account = await this.accountsService.createWithOAuth(
              {
                userId: newUser.id,
                email: profile.email,
                provider: provider,
                providerId: profile.providerId,
              },
              transactionalEntityManager,
            );

            return newUser;
          } catch (error) {
            throw error;
          }
        },
      );
    }

    const tokens = await this.generateTokens({
      userId: user.id,
      role: user.role,
    });

    return {
      externalProfile: profile,
      tokens,
      user,
    };
  }

  getOAuthRedirectUrl(provider: AccountProviderType): string {
    try {
      if (provider === AccountProviderType.GOOGLE) {
        return this.externalAuthService.getRedirectUrl(provider);
      } else {
        throw new Error('provider not supported');
      }
      // if (provider === AccountProviderType.GITHUB) {
      //   return `https://github.com/login/oauth/authorize?client_id=...`;
      // }
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AuthOperationException('get OAut redirect url', error);
    }
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
          },
          transactionalEntityManager,
        );

        const tokens = await this.generateTokens({
          userId: user.id,
          role: user.role,
        });

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

  async authenticateUser(credentials: LoginParams): Promise<AuthResult> {
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
      await this.usersService.isUserDisabled(user.id);
      const account = await this.accountsService.findOneByUserId(user.id);

      const payload = {
        userId: user.id,
        role: user.role,
      };

      const tokens = await this.generateTokens(payload);

      const result = {
        user,
        account,
        tokens,
      };

      return result;
    } catch (error) {
      if (error instanceof AccountNotFoundException) {
        throw new InvalidCredentials();
      }

      if (error instanceof DomainException) {
        throw error;
      }

      throw new AuthOperationException('authenticate user', error);
    }
  }

  async logout({ refreshTokenId, accessToken }: LogoutParams) {
    await this.redisRepository.blacklistRefreshToken(
      refreshTokenId,
      this.refreshTokenBlacklistTTL,
    );

    await this.redisRepository.deleteSession(refreshTokenId);

    try {
      const decoded: TokenDecodeResult = jwt.decode(
        accessToken,
      ) as TokenDecodeResult;
      if (decoded?.jti && decoded?.exp) {
        const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
        if (remainingTime > 0) {
          await this.redisRepository.blacklistAccessToken(
            decoded.jti,
            remainingTime,
          );
        }
      }
    } catch (error) {}

    return { success: true };
  }

  async validateAccessToken(accessToken: string): Promise<ValidateTokenResult> {
    try {
      const payload = jwt.verify(
        accessToken,
        this.accessTokenSecret,
      ) as TokenDecodeResult;

      if (await this.redisRepository.isAccessTokenBlacklisted(payload.jti)) {
        throw new AccessTokenInBlacklist();
      }

      await this.usersService.isUserDisabled(payload.userId);

      return {
        isValid: true,
        payload,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthOperationException('validate token', 'Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthOperationException(
          'validate token',
          'Invalid token signature',
        );
      }
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AuthOperationException('validate token', error);
    }
  }

  async processRefreshToken(oldRefreshTokenId: string): Promise<AuthResult> {
    try {
      const isRefreshTokenBlacklisted =
        await this.redisRepository.isRefreshTokenBlacklisted(oldRefreshTokenId);

      if (isRefreshTokenBlacklisted) {
        await this.redisRepository.blacklistRefreshToken(
          oldRefreshTokenId,
          this.refreshTokenBlacklistTTL,
        );
        // TODO: delete all user sessions

        await this.redisRepository.deleteSession(oldRefreshTokenId);

        throw new RefreshTokenInBlacklist();
      }

      const session =
        await this.redisRepository.findSessionByTokenId(oldRefreshTokenId);
      if (!session) {
        throw new SessionNotFound();
      }

      await this.usersService.isUserDisabled(session.userId);

      await this.redisRepository.blacklistRefreshToken(
        oldRefreshTokenId,
        this.refreshTokenBlacklistTTL,
      );

      const tokens = await this.generateTokens({
        userId: session.userId,
        role: session.role,
      });

      await this.redisRepository.deleteSession(oldRefreshTokenId);

      const user = await this.usersService.findOne(session.userId);
      const account = await this.accountsService.findOneByUserId(
        session.userId,
      );

      return {
        tokens,
        user,
        account,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthOperationException('refresh token', 'Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthOperationException('refresh token', 'Invalid token');
      }
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AuthOperationException('refresh token', error);
    }
  }

  private async generateTokens(payload: TokenPayload): Promise<TokenResult> {
    try {
      const refreshTokenId = uuidv4();

      const accessTokenExpiresIn = this.parseExpiresIn(
        this.accessTokenExpiresIn,
      );

      const accessToken = jwt.sign(
        { ...payload, jti: uuidv4() },
        this.accessTokenSecret,
        {
          expiresIn: accessTokenExpiresIn,
        },
      );

      const refreshTokenExpiresIn = this.parseExpiresIn(
        this.refreshTokenExpiresIn,
      );

      const session = { userId: payload.userId, role: payload.role };

      await this.redisRepository.storeRefreshTokenId(
        session,
        refreshTokenId,
        refreshTokenExpiresIn,
      );

      return {
        accessToken,
        refreshToken: refreshTokenId,
      };
    } catch (error) {
      if (error instanceof DomainException) {
        throw error;
      }

      throw new AuthOperationException('generate tokens', error);
    }
  }

  parseExpiresIn(expiresIn: string): number {
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
