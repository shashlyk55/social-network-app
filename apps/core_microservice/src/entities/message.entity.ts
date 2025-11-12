// entities/message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';
import { MessageAsset } from './many-to-many/message-asset.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ['text', 'image', 'video', 'file'],
    default: 'text',
  })
  type: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ nullable: true })
  repliedToId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  senderId: string;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;

  @Column()
  chatId: string;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  chat: Chat;

  @ManyToOne(() => Message, { nullable: true })
  repliedTo: Message;

  @OneToMany(() => MessageAsset, (messageAsset) => messageAsset.message)
  messageAssets: MessageAsset[];
}
