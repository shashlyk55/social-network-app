import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  VirtualColumn,
} from 'typeorm';
import { CommentLike } from './many-to-many/comment-like.entity';
import { Post } from './post.entity';
import { Profile } from './profile.entity';

@Entity('comments', { schema: 'main' })
@Index(['postId'])
@Index(['parentCommentId'])
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'int', name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'int', name: 'parent_comment_id', nullable: true })
  parentCommentId: number | null;

  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: Comment | null;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;

  @OneToMany(() => Comment, (comment) => comment.parentComment)
  replies: Comment[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  commentLikes: CommentLike[];

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."comments" WHERE "parent_comment_id" = ${alias}.id`,
  })
  repliesCount: number;

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."comments_likes" WHERE "comment_id" = ${alias}.id`,
  })
  likesCount: number;

  @VirtualColumn({
    type: 'bool',
    query: () => `SELECT false`,
  })
  isLiked: boolean;
}
