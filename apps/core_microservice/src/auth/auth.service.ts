import { Injectable } from '@nestjs/common';
import {
  LoginParams,
  OAuthCallbackParams,
  LogoutParams,
  InternalSignupParams,
  AccountProviderType,
  InternalAuthResult,
  ValidateTokenResult,
  TokenResult,
} from './types/auth-params.types';
import { InternalAuthDto } from './dto/internal-auth-response.dto';
import { InternalOAuthResponseDto } from './dto/internal-oauth-response.dto';
import { InternalHttpService } from 'src/internal-http/internal-http.service';

@Injectable()
export class AuthService {
  private readonly authUrl = process.env.AUTH_MICROSERVICE_URL;

  constructor(private readonly httpService: InternalHttpService) {}

  async handleSignup(
    params: InternalSignupParams,
  ): Promise<InternalAuthResult> {
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

  async handleLogin(params: LoginParams): Promise<TokenResult> {
    const response = await this.httpService.post<{ data: InternalAuthDto }>(
      `${this.authUrl}/auth/login`,
      params,
    );

    const responseData = response.data;

    //console.log(responseData);
    // const profile = await this.profilesService.findByUserId(
    //   responseData.user.id,
    // );

    // const result = AuthMapper.toAuthResult(responseData, profile);

    return responseData.tokens;
  }

  async handleOAuthInit(
    provider: AccountProviderType,
  ): Promise<{ url: string }> {
    const response = await this.httpService.get<{ data: { url: string } }>(
      `${this.authUrl}/auth/login/${provider}`,
      {},
    );

    const responseData = response.data;

    return responseData;
  }

  async handleOAuthCallback(params: OAuthCallbackParams) {
    const response = await this.httpService.get<{
      data: InternalOAuthResponseDto;
    }>(`${this.authUrl}/auth/callback/${params.provider}`, {
      params: { code: params.authorizationCode, error: params.error },
    });

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
    await this.httpService.post<void>(`${this.authUrl}/auth/logout`, {
      ...params,
    });
  }

  async validateToken(accessToken: string): Promise<ValidateTokenResult> {
    const response = await this.httpService.post<{ data: ValidateTokenResult }>(
      `${this.authUrl}/auth/validate`,
      { accessToken },
    );

    return response.data;
  }
}
