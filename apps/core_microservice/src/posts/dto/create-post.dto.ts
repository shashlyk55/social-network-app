import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  MaxLength,
  ArrayMaxSize,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is a post content',
    description: 'Post content',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  //@IsOptional()
  content: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether post is archived',
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    //example: null,
    description: 'Array of asset IDs to attach to the post',
  })
  @ArrayMaxSize(10)
  @IsArray()
  @IsOptional()
  assetIds?: number[];
}
