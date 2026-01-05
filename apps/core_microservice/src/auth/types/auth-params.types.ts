import { CreateProfileParams } from 'src/profiles/types/profile-params.types';

export enum AccountProviderType {
  LOCAL = 'local',
  GOOGLE = 'google',
  // FACEBOOK = 'facebook',
  // GITHUB = 'github',
  // TWITTER = 'twitter',
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export type LoginParams = {
  email: string;
  password: string;
};

export type OAuthCallbackParams = {
  authorizationCode?: string;
  error?: string;
  provider: AccountProviderType;
};

export type LogoutParams = {
  refreshToken: string;
  accessToken: string;
};

export type ValidateTokenParams = {
  accessToken: string;
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

export type AuthResult = {
  profile: ProfileResult;
  user: UserResult;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type InternalAuthResult = {
  user: InternalUserResult;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

export type ProfileResult = {
  id: number;
  username: string;
  displayName: string;
  birthday?: string;
  bio?: string;
  avatarUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserResult = {
  role: string;
  disabled: boolean;
};

export type InternalUserResult = {
  id: number;
  role: string;
  disabled: boolean;
};

export type TokenResult = {
  accessToken: string;
  refreshToken: string;
};

export type SignUpParams = {
  auth: RegisterParams;
  profile: CreateProfileParams;
};

export type ValidateTokenResult = {
  isValid: boolean;
  payload: TokenPayload;
};

export type TokenPayload = {
  userId: number;
  role: UserRole;
};
