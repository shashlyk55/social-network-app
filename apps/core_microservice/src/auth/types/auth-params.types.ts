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
  authorizationCode: string;
};

export type LogoutParams = {
  refreshTokenId: string;
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

export type ProfileResult = {
  username: string;
  displayName: string;
  birthday: string;
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

export type TokenResult = {
  accessToken: string;
  refreshToken: string;
};
