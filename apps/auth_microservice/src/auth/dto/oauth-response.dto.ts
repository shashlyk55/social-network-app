import { UserResponseDto } from 'src/users/dto/user-response.dto';
import {
  AuthResult,
  OAuthResult,
  TokenResult,
} from '../types/auth-params.types';
import { AccountResult } from 'src/accounts/types/account-service.types';
import { OAuthProfile } from '../types/external-auth.types';

export class OAuthResponseDto {
  tokens: TokenResult;
  user: UserResponseDto;
  profile: OAuthProfile;
  //   account: AccountResult;

  static toResponse(params: OAuthResult): OAuthResponseDto {
    const response: OAuthResponseDto = {
      tokens: {
        accessToken: params.tokens.accessToken,
        refreshToken: params.tokens.refreshToken,
      },
      user: {
        id: params.user.id,
        role: params.user.role,
        disabled: params.user.disabled,
      },
      //   account: {
      //     email: params.account.email,
      //     lastLoginAt: params.account.lastLoginAt,
      //   },
      profile: {
        email: params.externalProfile.email,
        name: params.externalProfile.name,
        providerId: params.externalProfile.providerId,
        avatarUrl: params.externalProfile.avatarUrl,
      },
    };

    return response;
  }
}
