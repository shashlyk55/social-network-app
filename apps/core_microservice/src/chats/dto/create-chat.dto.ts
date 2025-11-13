import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'Chat name (for group chats)',
    example: 'Innowise Group',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Chat type',
    enum: ['private', 'group'],
    example: 'group',
  })
  @IsEnum(['private', 'group'])
  type: string;

  @ApiProperty({
    description: 'Array of participant user IDs',
    example: [2, 3, 4],
    minItems: 1,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  participantIds: number[];

  @ApiProperty({
    description: 'Array of admin user IDs',
    example: [1, 2],
    required: false,
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  adminIds?: number[];

  @ApiProperty({
    description: 'Avatar asset ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  avatarId?: number;
}
