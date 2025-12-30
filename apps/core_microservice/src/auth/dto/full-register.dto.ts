import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { AccountProviderType, UserRole } from '../types/auth-params.types';

export class FullRegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Минимум 8 символов' })
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    enum: AccountProviderType,
    example: AccountProviderType.LOCAL,
  })
  @IsEnum(AccountProviderType)
  provider: AccountProviderType;

  @ApiPropertyOptional({ example: 'google-oauth2-id' })
  @IsString()
  @IsOptional()
  providerId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  createdById?: number;

  @ApiProperty({ example: 'johndoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ example: '2000-01-01', description: 'ISO 8601 date string' })
  @IsDateString()
  birthday: string;

  @ApiPropertyOptional({ example: 'Software Engineer from Toronto' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  isPublic: boolean;
}
