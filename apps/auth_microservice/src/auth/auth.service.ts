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
import { IRedisRepository } from './interfaces/IRedisRepository';

export class AuthService implements IAuthService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly accountsService: IAccountsService,
    private readonly usersService: IUsersService,
    private readonly dataSource: DataSource,
    private readonly redisRepository: IRedisRepository,
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

        const TTL = this.parseExpiresIn(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d')

      await this.redisRepository.storeRefreshTokenId(user.id, tokens.refreshToken, TTL);

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

      // TODO: implement deleting old nonexpired session

      const user = await this.usersService.findByEmail(email);

      const generateTokensParams = { userId: user.id, role: user.role };
      const tokens = this.generateTokens(generateTokensParams);

      const TTL = this.parseExpiresIn(this.refreshTokenExpiresIn)

      await this.redisRepository.storeRefreshTokenId(user.id, tokens.refreshToken, TTL);

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
  async processRefreshToken(oldRefreshToken: string): Promise<TokenResult> {
    try {
      // 1. Верифицируем refresh token
      const decoded = jwt.verify(
        oldRefreshToken, 
        this.refreshTokenSecret
      ) as TokenPayload & { jti?: string };
      
      const { userId, role } = decoded;
  
      // 2. Проверяем существование пользователя
      // const user = await this.usersService.findById(userId);
      // if (!user) {
      //   throw new AuthOperationException('refresh token', 'User not found');
      // }
  
      // 3. Проверяем, не заблокирован ли пользователь
      // if (user.isBlocked || !user.isActive) {
      //   await this.redisRepository.revokeAllUserTokens(userId);
      //   throw new AuthOperationException('refresh token', 'User is blocked');
      // }
  
      // 4. Проверяем, не отозван ли токен (по jti или самому токену)
      // const isTokenRevoked = await this.redisRepository.isRefreshTokenRevoked(
      //   userId, 
      //   oldRefreshToken
      // );
      
      // if (isTokenRevoked) {
      //   // Если токен скомпрометирован - отзываем все токены пользователя
      //   await this.redisRepository.revokeAllUserTokens(userId);
      //   throw new AuthOperationException('refresh token', 'Token has been revoked');
      // }
  
      // 5. Отзываем старый refresh token (rotation для безопасности)
      await this.redisRepository.removeRefreshToken(userId, oldRefreshToken);
  
      // 6. Генерируем новую пару токенов
      const generateTokensParams = { userId, role };
      const tokens = this.generateTokens(generateTokensParams);
  
      // 7. Сохраняем новый refresh token
      const TTL = this.parseExpiresIn(this.refreshTokenExpiresIn);
      await this.redisRepository.storeRefreshTokenId(
        userId, 
        tokens.refreshToken, 
        TTL
      );
  
      return tokens;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthOperationException('refresh token', 'Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthOperationException('refresh token', 'Invalid token');
      }
      if (error instanceof AuthOperationException) {
        throw error;
      }
      throw new AuthOperationException('refresh token', error.message);
    }
  }

  /**
   * Checks the signature, expiration, and blacklist status of an access_token.
   */
  async validateToken(acessToken: string): Promise<{
    isValid: boolean;
    payload?: TokenPayload;
    error?: string;
  }> {
    // TODO: Checks the signature, expiration, and blacklist status of an access_token.
    try {
      // 1. Проверяем базовую структуру токена
      // if (!acessToken || typeof acessToken !== 'string') {
      //   return { isValid: false, error: 'Invalid token format' };
      // }
  
      // 2. Верифицируем подпись и срок действия
      const payload = jwt.verify(
        acessToken, 
        this.accessTokenSecret
      ) as TokenPayload;
  
      // 3. Проверяем, не находится ли токен в черном списке
      // (например, если пользователь вышел из системы)
      const isBlacklisted = await this.redisRepository.isAccessTokenBlacklisted(
        acessToken
      );
      
      if (isBlacklisted) {
        return { isValid: false, error: 'Token has been revoked' };
      }
  
      // 4. Дополнительная проверка пользователя (опционально)
      // const user = await this.usersService.findById(payload.userId);
      // if (!user || user.isBlocked || !user.isActive) {
      //   return { isValid: false, error: 'User is not active' };
      // }
  
      return {
        isValid: true,
        payload
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { isValid: false, error: 'Token expired' };
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return { isValid: false, error: 'Invalid token signature' };
      }
      return { isValid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Exchanges the code for a user profile, finds/creates the user, and calls generateNewTokens.
   */
  exchageCodeForTokens(code: any) {
    // TODO: Exchanges the code for a user profile, finds/creates the user, and calls generateNewTokens.

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
