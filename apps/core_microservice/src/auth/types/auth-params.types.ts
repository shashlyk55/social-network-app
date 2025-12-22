import { Account, AccountProviderType } from 'src/entities/account.entity';
import { User, UserRole } from 'src/entities/user.entity';

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
  user: User;
  account: Account;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export type TokenResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
