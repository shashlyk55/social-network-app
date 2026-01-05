import { AccountProviderType } from 'src/entities/account.entity';
import {
  LoginParams,
  OAuthCallbackParams,
  LogoutParams,
  ValidateTokenParams,
  RegisterParams,
  RefreshTokenParams,
  TokenResult,
  AuthResult,
  ValidateTokenResult,
  OAuthResult,
} from '../types/auth-params.types';
import { OAuthProfile } from '../types/external-auth.types';

export interface IAuthService {
  authenticateUser(credentials: LoginParams): Promise<AuthResult>;
  processRefreshToken(oldRefreshToken: string): Promise<AuthResult>;
  validateAccessToken(acessToken: string): Promise<ValidateTokenResult>;
  exchageCodeForTokens(
    code: string,
    provider: AccountProviderType,
  ): Promise<OAuthResult>;
  registerUser(params: RegisterParams): Promise<AuthResult>;
  logout(params: LogoutParams);

  parseExpiresIn(expiresIn: string): number;
  getOAuthRedirectUrl(provider: AccountProviderType): string;
}
