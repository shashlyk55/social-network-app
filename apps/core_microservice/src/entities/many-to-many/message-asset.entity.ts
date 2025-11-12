import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Message } from '../message.entity';
import { Asset } from '../asset.entity';

@Entity()
export class MessageAsset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  messageId: number;

  @Column()
  assetId: number;

  @Column({ default: 0 })
  order: number;

  @Column({ nullable: true })
  caption: string;

  @CreateDateColumn()
  attachedAt: Date;

  @ManyToOne(() => Message, (message) => message.messageAssets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'messageId' })
  message: Message;

  @ManyToOne(() => Asset, (asset) => asset.messageAssets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'assetId' })
  asset: Asset;
}
