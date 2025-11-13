import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { MessageAsset } from './many-to-many/message-asset.entity';
import { Profile } from './profile.entity';
import { User } from './user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'chat_id' })
  chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'reply_to_message_id', nullable: true })
  replyToMessageId: number;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'reply_to_message_id' })
  replyToMessage: Message;

  @Column({ name: 'is_edited', default: false })
  isEdited: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdById: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedById: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => MessageAsset, (messageAsset) => messageAsset.message)
  messageAssets: MessageAsset[];
}
