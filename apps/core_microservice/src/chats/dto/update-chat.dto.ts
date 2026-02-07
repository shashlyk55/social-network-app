import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ChatType } from 'src/entities/chat.entity';

export class UpdateChatDto {
  @ApiProperty({
    example: ChatType.GROUP,
    description: 'Current chat type (used for validation logic)',
    enum: ChatType,
  })
  @IsEnum(ChatType)
  @IsNotEmpty()
  type: ChatType;

  @ApiPropertyOptional({ example: 'Updated Group Name' })
  @ValidateIf((o) => o.type === ChatType.GROUP)
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty for group chats' })
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 'New description',
    nullable: true,
  })
  @ValidateIf((o) => o.type === ChatType.GROUP)
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string | null;
}
