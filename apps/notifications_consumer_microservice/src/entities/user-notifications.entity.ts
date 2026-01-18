import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Notification } from './notification.entity';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  MESSAGE = 'message',
  SYSTEM = 'system',
}

@Entity('user_notifications', { schema: 'notification' })
export class UserNotification {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'recipient_id' })
  recipientId: number;

  @Column({ name: 'notification_id' })
  notificationId: number;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', name: 'read_at', nullable: true })
  readAt: Date | null;

  @ManyToOne(() => Notification)
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;
}
