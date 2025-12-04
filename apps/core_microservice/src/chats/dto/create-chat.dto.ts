// src/chats/dto/create-chat.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  MaxLength,
  IsEnum,
  ArrayMinSize,
  ArrayNotEmpty,
} from 'class-validator';
import { ChatType } from 'src/entities/chat.entity';

export class CreateChatDto {
  @ApiProperty({ example: 'General Chat', description: 'Chat name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'General discussion chat',
    description: 'Chat description',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: ChatType.GROUP,
    description: 'Chat type',
    enum: ChatType,
  })
  @IsEnum(ChatType)
  @IsNotEmpty()
  type: ChatType;

  @ApiProperty({ description: 'ID of user creating the chat' })
  @IsNotEmpty()
  createdById: number;

  @ApiProperty({
    //example: [1, 2, 3],
    example: null,
    description: 'Array of profile IDs to add as participants',
    required: false,
  })
  @IsArray()
  @IsOptional()
  participantProfileIds?: number[];
}
