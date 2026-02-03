import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  VirtualColumn,
} from 'typeorm';
import { PostAsset } from './many-to-many/post-asset.entity';
import { PostLike } from './many-to-many/post-like.entity';
import { Profile } from './profile.entity';
import { Comment } from './comment.entity';

@Entity('posts', { schema: 'main' })
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'bool', name: 'is_archived', default: false })
  isArchived: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostAsset, (postAsset) => postAsset.post)
  postAssets: PostAsset[];

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."posts_likes" WHERE "post_id" = ${alias}.id`,
  })
  likesCount: number;

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."comments" WHERE "post_id" = ${alias}.id`,
  })
  commentsCount: number;

  @VirtualColumn({
    type: 'bool',
    query: () => `SELECT false`,
  })
  isLiked: boolean;
}
