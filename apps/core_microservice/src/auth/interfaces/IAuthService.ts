import { FullAuthResponseDto } from '../dto/full-auth-response.dto';
import { LoginDto } from '../dto/login-dto';
import {
  AccountProviderType,
  LoginParams,
  LogoutParams,
  OAuthCallbackParams,
  RefreshTokenParams,
  RegisterParams,
  ValidateTokenParams,
} from '../types/auth-params.types';

export interface IAuthService {
  /**
   * Forwards credentials to the AuthenticationMicroservice.
   */
  handleLogin(params: LoginParams);
  /**
   * Forwards tokens to the AuthenticationMicroservice for renewal.
   */
  handleRefresh(params: RefreshTokenParams);
  /**
   * Forwards the refresh_token_idto the AuthenticationMicroservice to terminate the session.
   */
  handleLogout(params: LogoutParams): Promise<void>;
  /**
   * Forwards registration data to the AuthenticationMicroservice
   */
  handleSignUp(paras: RegisterParams);
  /**
   * Called by AccessGuard. Makes an HTTP request to the AuthenticationMicroservice to validate a token.
   */
  validateToken(params: ValidateTokenParams): Promise<any>;
  /**
   * Makes an HTTP request to the AuthenticationMicroservice to get a redirect URL.
   */
  handleOAuthInit(provider: AccountProviderType): Promise<{ url: string }>;
  /**
   * Forwards the authorization_code to the AuthenticationMicroservice.
   */
  handleOAuthCallback(params: OAuthCallbackParams);

  /**
   * Rollback creating user and account in auth_microservice if profile creating failed
   */
  rollbackRegistration(userId: number): Promise<void>;
}
