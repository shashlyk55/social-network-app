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
} from '../types/auth-params.types';

export interface IAuthService {
  authenticateUser(credentials: LoginParams): Promise<AuthResult>;
  processRefreshToken(oldRefreshToken: string): Promise<TokenResult>;
  validateAccessToken(acessToken: string): Promise<ValidateTokenResult>;
  exchageCodeForTokens(code);
  registerUser(params: RegisterParams): Promise<AuthResult>;
  logout(params: LogoutParams);

  parseExpiresIn(expiresIn: string): number;
  isUserBlocked(userId: number): Promise<boolean>;
}
