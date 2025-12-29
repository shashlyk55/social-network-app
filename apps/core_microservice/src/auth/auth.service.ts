import { Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/IAuthService';
import {
  LoginParams,
  OAuthCallbackParams,
  RefreshTokenParams,
  LogoutParams,
  ValidateTokenParams,
  RegisterParams,
  AccountProviderType,
  AuthResult,
} from './types/auth-params.types';
import { InternalHttpService } from './services/http.service';
import { InternalAuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService implements IAuthService {
  private readonly authUrl = process.env.AUTH_MICROSERVICE_URL;

  constructor(private readonly httpService: InternalHttpService) {}

  async handleSignUp(params: RegisterParams): Promise<AuthResult> {
    const response = this.httpService.post<InternalAuthResponseDto>(
      `${this.authUrl}/auth/signup`,
      params,
    );

    const result = 

    return result
  }

  async rollbackRegistration(userId: number): Promise<void> {
    // await this.httpService.delete(`${this.authUrl}/internal/users/${userId}`);
  }

  async handleLogin(params: LoginParams): Promise<AuthResult> {
    const response = this.httpService.post<InternalAuthResponseDto>(
      `${this.authUrl}/auth/login`,
      params,
    );

    const result = 

    return result
  }

  // handleLogin(params: LoginParams) {
  //   throw new Error('Method not implemented.');
  // }
  handleOAuthInit(provider: AccountProviderType): Promise<{ url: string }> {
    throw new Error('Method not implemented.');
  }
  handleOAuthCallback(params: OAuthCallbackParams) {
    throw new Error('Method not implemented.');
  }
  handleRefresh(params: RefreshTokenParams) {
    throw new Error('Method not implemented.');
  }
  handleLogout(params: LogoutParams): Promise<void> {
    throw new Error('Method not implemented.');
  }
  validateToken(params: ValidateTokenParams): Promise<any> {
    throw new Error('Method not implemented.');
  }
  // handleSignUp(paras: RegisterParams) {
  //   throw new Error('Method not implemented.');
  // }
  // rollbackRegistration(userId: number): Promise<void> {
  //   throw new Error('Method not implemented.');
  // }
}
