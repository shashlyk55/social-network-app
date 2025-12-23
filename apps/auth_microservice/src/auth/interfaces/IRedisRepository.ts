export interface IRedisRepository {
  isAccessTokenBlacklisted(accessToken: string): Promise<boolean>;
  blacklistToken(token: string, expiresIn: Date | number): Promise<void>;
  storeRefreshTokenId(userId: number, refreshTokenId: string, TTL: number): Promise<void>;
  findSessionByTokenId(tokenId: string): Promise<boolean>;

  removeRefreshToken(
    userId: number,
    refreshTokenId: string,
  ): Promise<void>
}
