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
import { Post } from '../post.entity';

@Entity('posts_assets', { schema: 'main' })
export class PostAsset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'int', name: 'asset_id' })
  assetId: number;

  @ManyToOne(() => Asset, (asset) => asset.postAssets, { onDelete: 'CASCADE' })
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
