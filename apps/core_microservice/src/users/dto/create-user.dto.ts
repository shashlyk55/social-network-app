import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({
    example: UserRole.ADMIN,
    description: 'User role',
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether user is disabled',
  })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  // @ApiProperty({ description: 'ID of user creating the record' })
  // @IsOptional()
  // createdById?: number;

  // Profile fields
  @ApiProperty({ example: 'john_doe', description: 'Username for profile' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name for profile' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ example: '1990-01-01', description: 'Birthday for profile' })
  @IsDateString()
  @IsNotEmpty()
  birthday: string;

  @ApiPropertyOptional({
    example: 'This is my bio',
    description: 'Bio for profile',
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL for profile',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether profile is public',
  })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  // Account fields
  @ApiProperty({
    example: 'john@example.com',
    description: 'Email for account',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password for account' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
