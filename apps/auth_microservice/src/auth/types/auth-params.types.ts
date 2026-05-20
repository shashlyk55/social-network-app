import { AccountResult } from 'src/accounts/types/account-service.types';
import { AccountProviderType } from 'src/entities/account.entity';
import { UserRole } from 'src/entities/user.entity';
import { UserResult } from 'src/users/types/user-service.types';
import { OAuthProfile } from './external-auth.types';

export type LoginParams = {
  email: string;
  password: string;
};

export type OAuthCallbackParams = {
  authorizationCode: string;
};

export type LogoutParams = {
  refreshTokenId: string;
  accessToken: string;
};

export type ValidateTokenParams = {
  accessToken: string;
};

export type ValidateTokenResult = {
  isValid: boolean;
  payload: TokenPayload;
};

export type RefreshTokenParams = {
  refreshToken: string;
};

export type RegisterParams = {
  email: string;
  password: string;
  role: UserRole;
  provider: AccountProviderType;
  providerId?: string;
  createdById?: number;
};

export type TokenPayload = {
  userId: number;
  role: UserRole;
};

export type TokenDecodeResult = {
  userId: number;
  role: UserRole;
  jti: string;
  iat: number;
  exp: number;
};

export type AuthResult = {
  user: UserResult;
  account: AccountResult;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type TokenResult = {
  accessToken: string;
  refreshToken: string;
};

export type ValidatePasswordResult = {
  user: UserResult;
  account: AccountResult;
};

export type Session = {
  userId: number;
  role: UserRole;
};

export type OAuthResult = {
  externalProfile: OAuthProfile;
  tokens: TokenResult;
  user: UserResult;
};
