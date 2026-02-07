import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  MaxLength,
  IsEnum,
  ArrayMinSize,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ChatType } from 'src/entities/chat.entity';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';

export class CreateChatDto {
  @ApiPropertyOptional({
    example: 'Design Team',
    description: 'Required only for GROUP chats',
  })
  @ValidateIf((o) => o.type === ChatType.GROUP)
  @IsString()
  @IsNotEmpty({ message: 'Group chat must have a name' })
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 'General discussion chat',
    description: 'Chat description',
  })
  @ValidateIf((o) => o.type === ChatType.GROUP)
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

  @ApiProperty({
    example: [2],
    description:
      'For PRIVATE chat: exactly 1 profile ID. For GROUP: at least 1.',
  })
  @IsArray()
  @ArrayMinSize(1)
  participantProfileIds: number[];

  @ApiPropertyOptional({
    description: 'The very first message to be sent upon chat creation',
    type: CreateMessageDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMessageDto)
  firstMessage?: CreateMessageDto;
}
