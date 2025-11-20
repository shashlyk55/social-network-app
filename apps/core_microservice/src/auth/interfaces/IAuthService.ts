import { LoginDto } from '../dto/login-dto';
import {
  LoginParams,
  LogoutParams,
  OAuthCallbackParams,
  RefreshParams,
  SignUpParams,
  ValidateTokenParams,
} from '../types/auth-params.types';

export interface IAuthService {
  handleLogin(params: LoginParams);
  handleOAuthInit();
  handleOAuthCallback(params: OAuthCallbackParams);
  handleRefresh(params: RefreshParams);
  handleLogout(params: LogoutParams);
  validateToken(params: ValidateTokenParams);
  handleSignUp(paras: SignUpParams);
}
