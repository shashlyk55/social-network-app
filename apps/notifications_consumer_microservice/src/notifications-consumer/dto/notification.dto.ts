import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NotificationType } from '@/entities/notification.entity';

export class NotificationDto {
  @ApiProperty({ example: 101 })
  @Expose()
  id: number;

  @ApiProperty({ enum: NotificationType })
  @Expose()
  type: NotificationType;

  @ApiProperty({ example: 'New comment' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'User commented on your post' })
  @Expose()
  message: string;

  @ApiProperty({
    example: { postId: 44, commentId: 87 },
    nullable: true,
  })
  @Expose()
  data: Record<string, unknown> | null;

  @ApiProperty({ example: '2026-05-17T10:15:00.000Z' })
  @Expose()
  createdAt: Date;
}
