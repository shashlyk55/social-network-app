import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from '../chat.entity';
import { User } from '../user.entity';

@Entity()
export class ChatParticipant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  chatId: number;

  @Column()
  userId: number;

  @Column({ default: 'member' })
  role: string; // 'member', 'admin', 'creator'

  @Column({ default: false })
  isMuted: boolean;

  @Column({ nullable: true })
  mutedUntil: Date;

  @Column({ default: null })
  lastReadMessageId: number;

  @CreateDateColumn()
  joinedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Chat, (chat) => chat.chatParticipants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chatId' })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chatParticipants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
