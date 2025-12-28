import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MessageAsset } from './many-to-many/message-asset.entity';
import { PostAsset } from './many-to-many/post-asset.entity';

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
}

@Entity('assets', { schema: 'main' })
export class Asset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_path' })
  filePath: string;

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.IMAGE,
  })
  fileType: string;

  @Column({ name: 'file_size' })
  fileSize: number;

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

  // Relations
  @OneToMany(() => PostAsset, (postAsset) => postAsset.asset)
  postAssets: PostAsset[];

  @OneToMany(() => MessageAsset, (messageAsset) => messageAsset.asset)
  messageAssets: MessageAsset[];
}
