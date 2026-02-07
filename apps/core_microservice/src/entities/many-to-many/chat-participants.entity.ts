import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Chat } from '../chat.entity';
import { Profile } from '../profile.entity';

export enum ChatParticipantRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  CREATOR = 'creator',
}

@Entity('chats_participants', { schema: 'main' })
export class ChatParticipant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'int', name: 'chat_id' })
  chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.chatParticipants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @Column({
    type: 'enum',
    enum: ChatParticipantRole,
    default: ChatParticipantRole.MEMBER,
  })
  role: ChatParticipantRole;

  @Column({
    type: 'timestamp',
    name: 'joined_at',
    nullable: true,
  })
  joinedAt: Date | null;

  @Column({ type: 'date', name: 'left_at', nullable: true })
  leftAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;
}
