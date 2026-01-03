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
  TokenPayload,
  ValidateTokenResult,
} from './types/auth-params.types';
import { InternalHttpService } from './services/internal-http.service';
import { InternalAuthDto } from './dto/internal-auth-response.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { IProfilesService } from 'src/profiles/interfaces/IProfilesService';
import { AuthMapper } from './utils/auth.mapper';
import { InternalOAuthResponseDto } from './dto/internal-oauth-response.dto';

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

    return result;
  }

  async handleOAuthInit(
    provider: AccountProviderType,
  ): Promise<{ url: string }> {
    const response = await this.httpService.get<{ data: { url: string } }>(
      `${this.authUrl}/auth/login/${provider}`,
      {},
    );

    //console.log(response);

    const responseData = response.data;

    return responseData;
  }

  async handleOAuthCallback(params: OAuthCallbackParams) {
    const response = await this.httpService.get<{
      data: InternalOAuthResponseDto;
    }>(`${this.authUrl}/auth/callback/${params.provider}`, {
      params: { code: params.authorizationCode, error: params.error },
    });

    //console.log(response);

    const responseData = response.data;

    return responseData;
  }

  async handleRefresh(refreshToken: string) {
    const response = await this.httpService.post<{ data: InternalAuthDto }>(
      `${this.authUrl}/auth/refresh`,
      { refreshToken },
    );

    const responseData = response.data;

    return responseData;
  }

  async handleLogout(params: LogoutParams) {
    const response = await this.httpService.post<void>(
      `${this.authUrl}/auth/logout`,
      { ...params },
    );
  }

  async validateToken(accessToken: string): Promise<ValidateTokenResult> {
    const response = await this.httpService.post<{ data: ValidateTokenResult }>(
      `${this.authUrl}/auth/validate`,
      { accessToken },
    );

    return response.data;
  }
}
