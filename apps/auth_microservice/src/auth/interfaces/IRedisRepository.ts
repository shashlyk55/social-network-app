export interface IRedisRepository {
  isTokenBlacklisted(token: string): Promise<boolean>;
  blacklistToken(token: string, expiresIn: Date | number): Promise<void>;
  storeRefreshTokenId(userId: number, refreshTokenId: string): Promise<void>;
  findSessionByTokenId(tokenId: string): Promise<boolean>;
}
