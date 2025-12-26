import { Session } from '../types/auth-params.types';

export interface IRedisRepository {
  // isAccessTokenBlacklisted(accessToken: string): Promise<boolean>;
  // blacklistAccessToken(
  //   accessToken: string,
  //   expiresIn: Date | number,
  // ): Promise<void>;
  // storeRefreshTokenId(
  //   userId: number,
  //   refreshTokenId: string,
  //   TTL: number,
  // ): Promise<void>;
  // findSessionByTokenId(tokenId: string): Promise<boolean>;
  // removeRefreshToken(
  //   userId: number,
  //   //refreshTokenId: string
  // ): Promise<void>;

  //isTokenBlacklisted(token);
  //blacklistToken(token, expiresIn: number);
  storeRefreshTokenId(session: Session, refresh_token_id, expiresIn: number);
  findSessionByTokenId(tokenId): Promise<Session | null>;
  deleteSession(tokenId);

  isAccessTokenBlacklisted(jti: string): Promise<boolean>;
  isRefreshTokenBlacklisted(tokenId: string): Promise<boolean>;
  blacklistAccessToken(jti: string, expiresInSeconds: number): Promise<void>;
  blacklistRefreshToken(tokenId, expiresIn: number): Promise<void>;
}
