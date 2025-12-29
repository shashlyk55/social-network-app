import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  MinLength,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { AccountProviderType, UserRole } from '../types/auth-params.types';

export class FullRegisterDto {
  // Auth Microservice
  @IsEmail()
  email: string;

  @IsString()
  // @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsEnum(AccountProviderType)
  provider: AccountProviderType;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsNumber()
  @IsOptional()
  createdById?: number;

  // Core Microservice (Profile)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsDateString()
  birthday: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
