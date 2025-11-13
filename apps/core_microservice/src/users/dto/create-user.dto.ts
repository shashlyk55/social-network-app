import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin',
    description: 'User role',
    enum: ['user', 'admin'],
  })
  @IsEnum(['user', 'admin'])
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether user is disabled',
  })
  @IsBoolean()
  @IsOptional()
  disabled?: boolean;

  @ApiProperty({ description: 'ID of user creating the record' })
  @IsNotEmpty()
  createdById: number;
}
