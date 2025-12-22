import { createClient, RedisClientType } from 'redis';
import { IRedisRepository } from './interfaces/IRedisRepository';

export class RedisAuthRepository implements IRedisRepository {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
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
   * Проверяет, находится ли токен в черном списке
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const result = await this.client.get(`blacklist:${token}`);
      return result !== null;
    } catch (error) {
      console.error('Error checking blacklisted token: ', error);
      return false;
    }
  }

  /**
   * Добавляет токен в черный список с указанным временем жизни
   */
  async blacklistToken(token: string, expiresIn: Date | number): Promise<void> {
    try {
      const key = `blacklist:${token}`;
      const ttl = this.calculateTTL(expiresIn);

      await this.client.setEx(key, ttl, 'blacklisted');
      console.log(`Token blacklisted for ${ttl} seconds`);
    } catch (error) {
      console.error('Error blacklisting token:', error);
      throw error;
    }
  }

  /**
   * Сохраняет ID refresh токена для пользователя
   */
  async storeRefreshTokenId(
    userId: number,
    refreshTokenId: string,
  ): Promise<void> {
    try {
      const key = `user:${userId}:refresh_tokens`;

      // Добавляем токен в множество и устанавливаем TTL (например, 7 дней)
      await this.client.sAdd(key, refreshTokenId);
      await this.client.expire(key, 7 * 24 * 60 * 60); // 7 дней
    } catch (error) {
      console.error('Error storing refresh token:', error);
      throw error;
    }
  }

  /**
   * Проверяет существование сессии по ID токена
   */
  async findSessionByTokenId(tokenId: string): Promise<boolean> {
    try {
      const result = await this.client.get(`session:${tokenId}`);
      return result !== null;
    } catch (error) {
      console.error('Error finding session by token id:', error);
      return false;
    }
  }

  /**
   * Дополнительный метод: удаление refresh токена пользователя
   */
  async removeRefreshToken(
    userId: number,
    refreshTokenId: string,
  ): Promise<void> {
    try {
      const key = `user:${userId}:refresh_tokens`;
      await this.client.sRem(key, refreshTokenId);
    } catch (error) {
      console.error('Error removing refresh token:', error);
      throw error;
    }
  }

  /**
   * Вспомогательный метод для расчета TTL
   */
  private calculateTTL(expiresIn: Date | number): number {
    if (expiresIn instanceof Date) {
      const now = Math.floor(Date.now() / 1000);
      const expiry = Math.floor(expiresIn.getTime() / 1000);
      return expiry - now;
    }
    return expiresIn;
  }
}
