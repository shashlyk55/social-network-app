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

@Entity('messages', { schema: 'main' })
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'chat_id' })
  chatId: number;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @Column({ type: 'int', name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', name: 'reply_to_message_id', nullable: true })
  replyToMessageId: number | null;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'reply_to_message_id' })
  replyToMessage: Message | null;

  @Column({ type: 'bool', name: 'is_edited', default: false })
  isEdited: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;

  @Column({ type: 'bool', default: false })
  deleted: boolean;

  @OneToMany(() => MessageAsset, (messageAsset) => messageAsset.message)
  messageAssets: MessageAsset[];
}
