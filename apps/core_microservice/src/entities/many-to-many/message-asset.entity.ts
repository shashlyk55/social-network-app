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

  @Column({ name: 'message_id' })
  messageId: number;

  @ManyToOne(() => Message, (message) => message.messageAssets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column({ name: 'asset_id' })
  assetId: number;

  @ManyToOne(() => Asset, (asset) => asset.messageAssets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @Column({ name: 'order_index', default: 0 })
  orderIndex: number;

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
  updatedById: number | null;

  // @ManyToOne(() => User, { nullable: true })
  // @JoinColumn({ name: 'updated_by' })
  // updatedBy: User;
}
