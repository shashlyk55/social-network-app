import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is a post content',
    description: 'Post content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Profile ID of the post author' })
  @IsNumber()
  @IsNotEmpty()
  profileId: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether post is archived',
  })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;

  @ApiProperty({ description: 'ID of user creating the post' })
  @IsNumber()
  @IsNotEmpty()
  createdById: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Array of asset IDs to attach to the post',
  })
  @IsArray()
  @IsOptional()
  assetIds?: number[];
}
