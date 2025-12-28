import { Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/IAuthService';
import {
  LoginParams,
  OAuthCallbackParams,
  RefreshTokenParams,
  LogoutParams,
  ValidateTokenParams,
  RegisterParams,
} from './types/auth-params.types';

@Injectable()
export class AuthService implements IAuthService {
  handleLogin(params: LoginParams) {
    throw new Error('Method not implemented.');
  }
  handleOAuthInit() {
    throw new Error('Method not implemented.');
  }
  handleOAuthCallback(params: OAuthCallbackParams) {
    throw new Error('Method not implemented.');
  }
  handleRefresh(params: RefreshTokenParams) {
    throw new Error('Method not implemented.');
  }
  handleLogout(params: LogoutParams) {
    throw new Error('Method not implemented.');
  }
  validateToken(params: ValidateTokenParams) {
    throw new Error('Method not implemented.');
  }
  handleSignUp(paras: RegisterParams) {
    throw new Error('Method not implemented.');
  }
}
