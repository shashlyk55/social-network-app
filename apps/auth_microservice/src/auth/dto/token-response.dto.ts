import { TokenResult } from '../types/auth-params.types';

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;

  static toResponse(params: TokenResult): TokenResponseDto {
    const response: TokenResponseDto = {
      ...params,
    };

    return response;
  }
}
