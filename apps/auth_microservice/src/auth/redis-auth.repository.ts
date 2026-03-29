import { createClient, RedisClientType } from 'redis';
import { IRedisRepository } from './interfaces/IRedisRepository';
import { Session } from './types/auth-params.types';
import { ConfigService } from 'src/config/config.service';

export class RedisAuthRepository implements IRedisRepository {
  private client: RedisClientType;

  private readonly SESSION_PREFIX = 'refresh_tokens:';
  private readonly BL_ACCESS_PREFIX = 'bl_access:';
  private readonly BL_REFRESH_PREFIX = 'bl_refresh:';

  constructor(private readonly configService: ConfigService) {
    const REDIS_URL = this.configService.get(
      'REDIS_URL',
      'redis://:redis_password@localhost:6379',
    );

    this.client = createClient({
      url: REDIS_URL,
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

  async isAccessTokenBlacklisted(jti: string): Promise<boolean> {
    const result = await this.client.exists(`${this.BL_ACCESS_PREFIX}${jti}`);
    return result === 1;
  }

  async isRefreshTokenBlacklisted(tokenId: string): Promise<boolean> {
    const result = await this.client.exists(
      `${this.BL_REFRESH_PREFIX}${tokenId}`,
    );
    return result === 1;
  }

  async blacklistAccessToken(
    jti: string,
    expiresInSeconds: number,
  ): Promise<void> {
    await this.client.set(`${this.BL_ACCESS_PREFIX}${jti}`, 'revoked', {
      EX: expiresInSeconds,
    });
  }

  async blacklistRefreshToken(
    tokenId: string,
    gracePeriodSeconds: number = 60,
  ) {
    await this.client.set(`${this.BL_REFRESH_PREFIX}${tokenId}`, 'used', {
      EX: gracePeriodSeconds,
    });
  }

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

  async findSessionByTokenId(tokenId): Promise<Session | null> {
    const key = `${this.SESSION_PREFIX}${tokenId}`;
    const session = await this.client.get(key);

    if (!session) {
      return null;
    }

    const parsedJson = JSON.parse(session);

    return parsedJson.session;
  }

  async deleteSession(tokenId) {
    const key = `${this.SESSION_PREFIX}${tokenId}`;
    await this.client.del(key);
  }
}
