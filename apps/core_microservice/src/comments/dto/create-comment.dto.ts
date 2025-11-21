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

  @ApiProperty({ description: 'Profile ID of the comment author' })
  @IsNumber()
  @IsNotEmpty()
  profileId: number;

  @ApiPropertyOptional({ description: 'Parent comment ID for replies' })
  @IsNumber()
  @IsOptional()
  parentCommentId?: number;

  @ApiProperty({ description: 'ID of user creating the comment' })
  @IsNumber()
  @IsNotEmpty()
  createdById: number;
}
