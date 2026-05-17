import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { NotificationDto } from './notification.dto';

export class UserNotificationResponseDto {
  @ApiProperty({ example: false })
  @Expose()
  isRead: boolean;

  @ApiProperty({
    example: null,
    nullable: true,
  })
  @Expose()
  readAt: Date | null;

  @ApiProperty({ type: NotificationDto })
  @Expose()
  @Type(() => NotificationDto)
  notification: NotificationDto;
}
