import { InternalUserDto } from './internal-user.dto';

export class InternalAuthDto {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: InternalUserDto;
}
