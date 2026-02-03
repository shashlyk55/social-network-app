import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MessageAsset } from './many-to-many/message-asset.entity';
import { PostAsset } from './many-to-many/post-asset.entity';

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
}

@Entity('assets', { schema: 'main' })
export class Asset {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', name: 'file_name' })
  fileName: string;

  @Column({ type: 'varchar', name: 'file_path' })
  filePath: string; // TODO: delete this field when move to S3

  @Column({ type: 'varchar', name: 'download_url', nullable: true })
  downloadUrl: string | null; // TODO: delete nullable when move to S3

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.DOCUMENT,
  })
  fileType: FileType;

  @Column({ type: 'int', name: 'file_size' })
  fileSize: number;

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

  // Relations
  @OneToMany(() => PostAsset, (postAsset) => postAsset.asset)
  postAssets: PostAsset[];

  @OneToMany(() => MessageAsset, (messageAsset) => messageAsset.asset)
  messageAssets: MessageAsset[];
}
