import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { MessageAsset } from './many-to-many/message-asset.entity';
import { PostAsset } from './many-to-many/post-asset.entity';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: ['image', 'video', 'audio', 'document'],
    default: 'image',
  })
  type: string;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column()
  uploaderId: string;

  @ManyToOne(() => User)
  uploader: User;

  @OneToMany(() => PostAsset, (postAsset) => postAsset.asset)
  postAssets: PostAsset[];

  @OneToMany(() => MessageAsset, (messageAsset) => messageAsset.asset)
  messageAssets: MessageAsset[];
}
