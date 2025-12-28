import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { AuthResult } from '../types/auth-params.types';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  //expiresIn: number;
  user: UserResponseDto;

  static toResponse(params: AuthResult): AuthResponseDto {
    const response: AuthResponseDto = {
      accessToken: params.tokens.accessToken,
      refreshToken: params.tokens.refreshToken,
      //expiresIn: params.tokens.expiresIn,
      user: params.user,
      // user: {
      //   id: params.user.id,
      //   role: params.user.role,
      //   disabled: params.user.disabled
      // }
    };

    return response;
  }
}
