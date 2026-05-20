import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ChatParticipant } from './many-to-many/chat-participants.entity';
import { Message } from './message.entity';

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
}

@Entity('chats', { schema: 'main' })
export class Chat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: ChatType, default: ChatType.GROUP })
  type: ChatType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number;

  @OneToMany(() => ChatParticipant, (participant) => participant.chat)
  chatParticipants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
