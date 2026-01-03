import { UserResponseDto } from './full-auth-response.dto';
import { InternalUserDto } from './internal-user.dto';
import { OAuthProfileResponseDto } from './oauth-profile.dto';

export class InternalOAuthResponseDto {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: InternalUserDto;
  profile: OAuthProfileResponseDto;
}
