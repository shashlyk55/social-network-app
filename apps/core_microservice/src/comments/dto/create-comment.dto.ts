import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a comment', description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  @ApiProperty({ description: 'Post ID' })
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiPropertyOptional({ description: 'Parent comment ID for replies' })
  @IsNumber()
  @IsOptional()
  parentCommentId?: number;
}
