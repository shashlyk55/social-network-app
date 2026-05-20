import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asset } from '../asset.entity';
import { Message } from '../message.entity';

@Entity('messages_assets', { schema: 'main' })
export class MessageAsset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'message_id' })
  messageId: number;

  @ManyToOne(() => Message, (message) => message.messageAssets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ type: 'int', name: 'asset_id' })
  assetId: number;

  @ManyToOne(() => Asset, (asset) => asset.messageAssets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ type: 'int', name: 'order_index', default: 0 })
  orderIndex: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;
}
