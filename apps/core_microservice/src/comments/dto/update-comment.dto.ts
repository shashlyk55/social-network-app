import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Updated comment content',
    description: 'Comment content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'ID of user updating the comment' })
  @IsNumber()
  @IsOptional()
  updatedById?: number;
}
