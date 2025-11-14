import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'user',
    description: 'User role',
    enum: ['user', 'admin'],
  })
  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether user is disabled',
  })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  @ApiPropertyOptional({ description: 'ID of user updating the record' })
  @IsNumber()
  @IsOptional()
  updatedById?: number;

  // Profile fields
  @ApiPropertyOptional({
    example: 'john_doe_updated',
    description: 'Username for profile',
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    example: 'John Doe Updated',
    description: 'Display name for profile',
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Birthday for profile',
  })
  @IsDateString()
  @IsOptional()
  birthday?: string;

  @ApiPropertyOptional({
    example: 'Updated bio',
    description: 'Bio for profile',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/new-avatar.jpg',
    description: 'Avatar URL for profile',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether profile is public',
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
