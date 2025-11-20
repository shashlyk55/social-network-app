import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ChatType } from 'src/entities/chat.entity';

export class UpdateChatDto {
  @ApiPropertyOptional({
    example: 'Updated Chat Name',
    description: 'Chat name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 'Updated description',
    description: 'Chat description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: ChatType.GROUP,
    description: 'Chat type',
    enum: ChatType,
  })
  @IsOptional()
  @IsEnum(ChatType)
  type: ChatType;

  @ApiPropertyOptional({ description: 'ID of user updating the chat' })
  @IsOptional()
  updatedById?: number;
}
