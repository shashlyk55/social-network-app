// src/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AccountProviderType } from 'src/entities/account.entity';
import { UserRole } from 'src/entities/user.entity';

class UserReferenceDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({
    example: UserRole.ADMIN,
    enum: UserRole,
    description: 'User role',
  })
  role: UserRole;
}

class ProfileResponseDto {
  @ApiProperty({ example: 1, description: 'Profile ID' })
  id: number;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'John Doe', description: 'Display name' })
  displayName: string;

  @ApiProperty({ example: '1990-01-01', description: 'Birthday' })
  birthday: Date;

  @ApiProperty({
    example: 'This is my bio',
    description: 'Bio',
    nullable: true,
  })
  bio: string | null;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
    nullable: true,
  })
  avatarUrl: string | null;

  @ApiProperty({ example: true, description: 'Whether profile is public' })
  isPublic: boolean;

  @ApiProperty({ description: 'Profile creation date' })
  createdAt: Date;
}

class AccountResponseDto {
  @ApiProperty({ example: 1, description: 'Account ID' })
  id: number;

  @ApiProperty({ example: 'john@example.com', description: 'Email' })
  email: string;

  @ApiProperty({
    example: AccountProviderType.LOCAL,
    enum: AccountProviderType,
    description: 'Authentication provider',
  })
  provider: AccountProviderType;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last login date',
    nullable: true,
  })
  lastLoginAt: Date | null;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({
    example: UserRole.ADMIN,
    enum: UserRole,
    description: 'User role',
  })
  role: UserRole;

  @ApiProperty({ example: false, description: 'Whether user is disabled' })
  disabled: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Creator ID' })
  createdById: number;

  @ApiProperty({ example: 2, description: 'Updater ID', nullable: true })
  updatedById: number | null;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who created this record',
    nullable: true,
  })
  createdBy?: UserReferenceDto;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who updated this record',
    nullable: true,
  })
  updatedBy?: UserReferenceDto;

  @ApiProperty({
    type: ProfileResponseDto,
    description: 'User profile',
    nullable: true,
  })
  profile?: ProfileResponseDto;

  @ApiProperty({
    type: AccountResponseDto,
    description: 'User account',
    nullable: true,
  })
  account?: AccountResponseDto;
}
