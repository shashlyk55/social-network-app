export interface IRedisRepository {
  isTokenBlacklisted(token: string);
  blacklistToken(token: string, expiresIn: Date | number);
  storeRefreshTokenId(userId: number, refreshTokenId: number);
  findSessionByTokenId(tokenId: number);
}
