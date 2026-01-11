import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  MaxLength,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is a post content',
    description: 'Post content',
  })
  @IsString()
  @MaxLength(5000)
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether post is archived',
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiPropertyOptional({
    //example: [1, 2, 3],
    example: null,
    description: 'Array of asset IDs to attach to the post',
  })
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  assetIds?: number[];
}
