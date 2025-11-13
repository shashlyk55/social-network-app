import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    example: 'Updated post content',
    description: 'Post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether post is archived',
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiPropertyOptional({ description: 'ID of user updating the post' })
  @IsNumber()
  @IsOptional()
  updatedById?: number;

  @ApiPropertyOptional({
    example: [4, 5],
    description: 'Array of asset IDs to attach to the post',
  })
  @IsArray()
  @IsOptional()
  assetIds?: number[];
}
