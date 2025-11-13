// src/chats/dto/create-chat.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  MaxLength,
  IsEnum,
} from 'class-validator';

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
  description?: string;

  @ApiProperty({
    example: 'private',
    description: 'Chat type',
    enum: ['private', 'group'],
  })
  @IsEnum(['private', 'group'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'ID of user creating the chat' })
  @IsNotEmpty()
  createdById: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of profile IDs to add as participants',
  })
  @IsArray()
  @IsNotEmpty()
  participantProfileIds: number[];
}
