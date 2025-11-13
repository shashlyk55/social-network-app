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

  @Column({ type: 'enum', enum: ['private', 'group'], default: 'group' })
  type: string;

  @Column({ nullable: true })
  avatarId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  creatorId: number;

  @ManyToOne(() => User, (user) => user.createdChats, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @OneToMany(() => ChatParticipant, (participant) => participant.chat, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  chatParticipants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.chat, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  messages: Message[];

  @ManyToMany(() => User)
  @JoinTable()
  admins: User[];
}
