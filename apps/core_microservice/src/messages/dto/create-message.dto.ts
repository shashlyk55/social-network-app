import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Привет! Давай пообщаемся.',
    description: 'Текст сообщения',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @ApiPropertyOptional({
    example: 123,
    description: 'ID сообщения, на которое создается ответ',
  })
  @IsOptional()
  @IsInt()
  replyToMessageId?: number;
}
