import { PartialType } from '@nestjs/swagger';
import { CreateChatDto } from './create-chat.dto';
import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChatDto extends PartialType(CreateChatDto) {
  @ApiProperty({
    description: 'Updated chat name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated avatar asset ID',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  avatarId?: number;
}
