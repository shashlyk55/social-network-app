import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
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
}
