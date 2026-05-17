import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationType {
  POST_LIKE = 'POST_LIKE',
  NEW_COMMENT = 'NEW_COMMENT',
  COMMENT_REPLY = 'COMMENT_REPLY',
  COMMENT_LIKE = 'COMMENT_LIKE',
  FOLLOW_REQUEST = 'FOLLOW_REQUEST',
  ACCEPT_FOLLOW_REQUEST = 'ACCEPT_FOLLOW_REQUEST',
  DECLINE_FOLLOW_REQUEST = 'DECLINE_FOLLOW_REQUEST',
  SYSTEM = 'SYSTEM',
}

@Entity('notifications', { schema: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;
}
