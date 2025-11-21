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
import { UserRole } from 'src/entities/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: UserRole.ADMIN,
    description: 'User role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

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
  @MaxLength(50)
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    example: 'John Doe Updated',
    description: 'Display name for profile',
  })
  @IsString()
  @MaxLength(100)
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
  @MaxLength(500)
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/new-avatar.jpg',
    description: 'Avatar URL for profile',
  })
  @IsString()
  @MaxLength(500)
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
