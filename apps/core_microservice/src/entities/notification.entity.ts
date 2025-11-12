// entities/notification.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ['like', 'comment', 'follow', 'message', 'system'],
    default: 'system',
  })
  type: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  recipientId: string;

  @ManyToOne(() => User)
  recipient: User;

  @Column({ nullable: true })
  senderId: string;

  @ManyToOne(() => User, { nullable: true })
  sender: User;

  @CreateDateColumn()
  createdAt: Date;
}
