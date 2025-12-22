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
  processRefreshToken(old_refresh_token_id: RefreshTokenParams);
  validateToken(params: ValidateTokenParams);
  exchageCodeForTokens(code);
  registerUser(params: RegisterParams): Promise<AuthResult>;
}
