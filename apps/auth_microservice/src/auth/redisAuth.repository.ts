import { createClient, RedisClientType } from 'redis';
import { IRedisRepository } from './interfaces/IRedisRepository';
import { Session } from './types/auth-params.types';

export class RedisAuthRepository implements IRedisRepository {
  private client: RedisClientType;
  private BLACKLIST_PREFIX: string;

  private readonly SESSION_PREFIX = 'refresh_tokens:';
  private readonly BL_ACCESS_PREFIX = 'bl_access:';
  private readonly BL_REFRESH_PREFIX = 'bl_refresh:';

  constructor() {
    this.client = createClient({
      url:
        process.env.REDIS_URL ||
        'redis://localhost:6379?passowrd=redis_password',
    });

    this.client.on('error', (err) =>
      console.error('Redis client error: ', err),
    );

    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('Connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis: ', error);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  getClient(): RedisClientType {
    return this.client;
  }

  /**
   * Проверка для Middleware: не отозван ли JWT (Access Token)
   */
  async isAccessTokenBlacklisted(jti: string): Promise<boolean> {
    const result = await this.client.exists(`${this.BL_ACCESS_PREFIX}${jti}`);
    return result === 1;
  }

  /**
   * Проверка для эндпоинта Refresh: не использовался ли ID ранее
   */
  async isRefreshTokenBlacklisted(tokenId: string): Promise<boolean> {
    const result = await this.client.exists(
      `${this.BL_REFRESH_PREFIX}${tokenId}`,
    );
    return result === 1;
  }

  /**
   * Блокировка Access Token (JWT)
   * Ключ живет в Redis до момента, когда токен сам бы истек по времени (exp)
   */
  async blacklistAccessToken(
    jti: string,
    expiresInSeconds: number,
  ): Promise<void> {
    await this.client.set(`${this.BL_ACCESS_PREFIX}${jti}`, 'revoked', {
      EX: expiresInSeconds,
    });
  }

  /**
   * Блокировка старого Refresh Token (после того как он был использован)
   * Живет короткое время (например, 1-2 минуты) для предотвращения Race Conditions
   */
  async blacklistRefreshToken(
    tokenId: string,
    gracePeriodSeconds: number = 60,
  ) {
    await this.client.set(`${this.BL_REFRESH_PREFIX}${tokenId}`, 'used', {
      EX: gracePeriodSeconds,
    });
  }

  /**
   * 8/12. SET refresh_tokens:{id} {userId, ...} (из схем Login/Register)
   * Сохраняет сессию пользователя, привязанную к Refresh Token ID.
   */
  async storeRefreshTokenId(
    session: Session,
    refreshTokenId,
    expiresIn: number,
  ) {
    const key = `${this.SESSION_PREFIX}${refreshTokenId}`;
    const data = JSON.stringify({
      session,
      createdAt: new Date().toISOString(),
    });

    await this.client.set(key, data, { EX: expiresIn });
  }

  /**
   * 1/2. GET refresh_tokens:{id} (из схем Refresh Token / Failed Refresh)
   * Ищет активную сессию по ID рефреш-токена.
   */
  async findSessionByTokenId(tokenId): Promise<Session | null> {
    const key = `${this.SESSION_PREFIX}${tokenId}`;
    const session = await this.client.get(key);

    if (!session) {
      return null;
    }

    return JSON.parse(session);
  }

  /**
   * 4. DEL refresh_tokens:{id} (из схемы Logout Flow)
   * Удаляет сессию при выходе пользователя.
   */
  async deleteSession(tokenId) {
    const key = `${this.SESSION_PREFIX}${tokenId}`;
    await this.client.del(key);
  }
}
