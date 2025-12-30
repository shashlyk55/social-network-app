import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../types/auth-params.types';
import { ProfileResponseDto } from 'src/profiles/dto/profile-response.dto';

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class UserResponseDto {
  @ApiProperty({ enum: UserRole })
  role: string;

  @ApiProperty()
  disabled: boolean;
}

export class FullAuthResponseDto {
  @ApiProperty({ type: ProfileResponseDto })
  profile: ProfileResponseDto;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;
}
