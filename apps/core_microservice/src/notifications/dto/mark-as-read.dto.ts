import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class MarkAsReadDto {
  @ApiPropertyOptional({ example: true, description: 'Mark as read or unread' })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiPropertyOptional({ description: 'ID of user marking the notification' })
  @IsOptional()
  updatedById?: number;
}
