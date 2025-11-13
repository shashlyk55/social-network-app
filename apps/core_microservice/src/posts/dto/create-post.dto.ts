import {
  IsString,
  IsOptional,
  IsArray,
  IsUUID,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Content of the post',
    example: 'This is my first post!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Location where post was created',
    example: 'New York, USA',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    description: 'Array of asset IDs to attach to the post',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  assetIds?: number[];
}
