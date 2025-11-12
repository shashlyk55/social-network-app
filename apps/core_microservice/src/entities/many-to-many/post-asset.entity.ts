import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Post } from '../post.entity';
import { Asset } from '../asset.entity';

@Entity()
export class PostAsset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  postId: number;

  @Column()
  assetId: number;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  attachedAt: Date;

  @ManyToOne(() => Post, (post) => post.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => Asset, (asset) => asset.postAssets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assetId' })
  asset: Asset;
}
