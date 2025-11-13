import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    description: 'Updated content of the comment',
    required: false,
    example: 'Updated comment content',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  @IsOptional()
  content?: string;
}
