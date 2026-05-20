import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'johndoe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayName?: string;

  @ApiProperty({ example: '2000-01-01', description: 'ISO 8601 date string' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({ example: 'Software Engineer from Toronto' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
