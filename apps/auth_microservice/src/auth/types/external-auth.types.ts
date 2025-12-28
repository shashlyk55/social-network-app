import { AccountProviderType } from 'src/entities/account.entity';

export type OAuthProfile = {
  email: string;
  name: string;
  providerId: string;
  avatarUrl?: string;
};

export type ProviderConfig = {
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  userUrl: string;
  scope: string;
};

export type OAuthProvidersConfig = Partial<
  Record<AccountProviderType, ProviderConfig>
>;

export interface GoogleUserResponse {
  sub: string; // Уникальный ID
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

/** Ответ от GitHub User API */
export interface GitHubUserResponse {
  id: number; // Уникальный ID
  login: string; // username
  name: string | null;
  email: string | null; // Может быть null, если скрыт в настройках
  avatar_url: string;
}

/** Типовой ответ на запрос токена */
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}
