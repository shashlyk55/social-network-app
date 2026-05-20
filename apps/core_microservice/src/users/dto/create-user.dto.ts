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
  MinLength,
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

  // Profile fields
  @ApiProperty({ example: 'john_doe', description: 'Username for profile' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name for profile' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
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
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL for profile',
  })
  @IsString()
  @MaxLength(500)
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
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;
}
