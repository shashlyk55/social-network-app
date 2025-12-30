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
  InternalAuthResult,
} from './types/auth-params.types';
import { InternalHttpService } from './services/internal-http.service';
import { InternalAuthDto } from './dto/internal-auth-response.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { IProfilesService } from 'src/profiles/interfaces/IProfilesService';
import { AuthMapper } from './utils/auth.mapper';

@Injectable()
export class AuthService implements IAuthService {
  private readonly authUrl = process.env.AUTH_MICROSERVICE_URL;
  private readonly authPort = process.env.AUTH_MICROSERVICE_PORT;

  constructor(
    private readonly httpService: InternalHttpService,
    private readonly profilesService: ProfilesService,
  ) {}

  async handleSignUp(params: RegisterParams): Promise<InternalAuthResult> {
    const response = await this.httpService.post<{ data: InternalAuthDto }>(
      `${this.authUrl}/auth/register`,
      params,
    );

    const responseData = response.data;

    const result: InternalAuthResult = {
      tokens: responseData.tokens,
      user: responseData.user,
    };

    return result;
  }

  async rollbackRegistration(userId: number): Promise<void> {
    await this.httpService.delete(`${this.authUrl}/users/${userId}`);
  }

  async handleLogin(params: LoginParams): Promise<AuthResult> {
    const response = await this.httpService.post<{ data: InternalAuthDto }>(
      `${this.authUrl}/auth/login`,
      params,
    );

    const responseData = response.data;

    console.log(responseData);
    const profile = await this.profilesService.findByUserId(
      responseData.user.id,
    );

    const result = AuthMapper.toAuthResult(responseData, profile);
    console.log(result);

    return result;
  }

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
