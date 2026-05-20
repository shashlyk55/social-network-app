import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'Updated comment content',
    description: 'Comment content',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  content?: string;
}
