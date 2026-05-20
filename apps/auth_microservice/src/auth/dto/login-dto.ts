import { IsString } from 'class-validator';
import { LoginParams } from '../types/auth-params.types';

export class LoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  static toLoginParams(dto: LoginDto): LoginParams {
    const params: LoginParams = {
      email: dto.email,
      password: dto.password,
    };

    return params;
  }
}
