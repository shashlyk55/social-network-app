import {
  LoginParams,
  OAuthCallbackParams,
  LogoutParams,
  ValidateTokenParams,
  RegisterParams,
  RefreshTokenParams,
  TokenResult,
  AuthResult,
} from '../types/auth-params.types';

export interface IAuthService {
  authenticateUser(credentials: LoginParams): Promise<TokenResult>;
  processRefreshToken(oldRefreshToken: string): Promise<TokenResult>;
  validateToken(acessToken: string);
  exchageCodeForTokens(code);
  registerUser(params: RegisterParams): Promise<AuthResult>;
}
