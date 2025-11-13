import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEnum } from 'class-validator';

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
    example: 'group',
    description: 'Chat type',
    enum: ['private', 'group'],
  })
  @IsOptional()
  @IsEnum(['private', 'group'])
  type: string;

  @ApiPropertyOptional({ description: 'ID of user updating the chat' })
  @IsOptional()
  updatedById?: number;
}
