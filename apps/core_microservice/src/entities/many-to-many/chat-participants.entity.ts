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
import { User } from '../user.entity';

export enum ChatParticipantRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  CREATOR = 'creator',
}

@Entity('chats_participants', { schema: 'main' })
export class ChatParticipant {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ name: 'chat_id' })
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

  @Column({ name: 'joined_at', default: () => 'CURRENT_TIMESTAMP' })
  joinedAt: Date;

  @Column({ name: 'left_at', nullable: true })
  leftAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdById: number;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'created_by' })
  // createdBy: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedById: number;

  // @ManyToOne(() => User, { nullable: true })
  // @JoinColumn({ name: 'updated_by' })
  // updatedBy: User;
}
