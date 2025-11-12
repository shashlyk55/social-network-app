// entities/chat.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { ChatParticipant } from './many-to-many/chat-participants.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'enum', enum: ['private', 'group'], default: 'private' })
  type: string;

  @Column({ nullable: true })
  avatarId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, (user) => user.createdChats)
  creator: User;

  @OneToMany(() => ChatParticipant, (participant) => participant.chat)
  chatParticipants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];
}
