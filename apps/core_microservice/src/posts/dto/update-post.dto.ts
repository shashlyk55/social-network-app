import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'Updated post content',
    description: 'Post content',
  })
  @IsString()
  @MaxLength(5000)
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'ID of user updating the post' })
  @IsNumber()
  @IsOptional()
  updatedById?: number;

  @ApiPropertyOptional({
    //example: [4, 5],
    example: null,
    description: 'Array of asset IDs to attach to the post',
  })
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  assetIds?: number[];
}
