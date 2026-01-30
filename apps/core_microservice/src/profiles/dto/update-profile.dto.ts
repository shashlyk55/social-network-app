import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsBoolean,
  ValidateIf,
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

  @ApiProperty({
    example: '2000-01-01',
    description: 'ISO 8601 date string or null',
    nullable: true,
  })
  @IsOptional()
  // Позволяем значению быть null для class-validator
  @ValidateIf((object, value) => value !== null)
  @IsDateString()
  birthday?: string | null;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsString()
  @IsOptional()
  bio?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
