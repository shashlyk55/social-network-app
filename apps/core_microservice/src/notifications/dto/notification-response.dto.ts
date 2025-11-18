import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from 'src/entities/notification.entity';

class UserReferenceDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'user', description: 'User role' })
  role: string;
}

export class NotificationResponseDto {
  @ApiProperty({ example: 1, description: 'Notification ID' })
  id: number;

  @ApiProperty({
    example: NotificationType.LIKE,
    description: 'Notification type',
    enum: NotificationType,
  })
  type: NotificationType;

  @ApiProperty({ example: 'New like', description: 'Notification title' })
  title: string;

  @ApiProperty({
    example: 'Someone liked your post',
    description: 'Notification message',
  })
  message: string;

  @ApiProperty({
    example: { postId: 1, profileId: 2 },
    description: 'Additional data for notification',
    nullable: true,
  })
  data: any;

  @ApiProperty({ example: false, description: 'Whether notification is read' })
  isRead: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Read date',
    nullable: true,
  })
  readAt: Date | null;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt: Date;

  @ApiProperty({ example: 1, description: 'Creator ID' })
  createdById: number;

  @ApiProperty({ example: 2, description: 'Updater ID', nullable: true })
  updatedById: number | null;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who created this notification',
  })
  createdBy: UserReferenceDto;

  @ApiProperty({
    type: UserReferenceDto,
    description: 'User who updated this notification',
    nullable: true,
  })
  updatedBy?: UserReferenceDto;
}
