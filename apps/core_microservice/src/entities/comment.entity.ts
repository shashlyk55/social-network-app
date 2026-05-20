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
  RelationCount,
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

  @Column({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ name: 'parent_comment_id', nullable: true })
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

  @Column({ name: 'created_by' })
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
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."comments" WHERE "parent_comment_id" = ${alias}.id`,
  })
  repliesCount: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."comments_likes" WHERE "comment_id" = ${alias}.id`,
  })
  likesCount: number;

  @VirtualColumn({
    query: (alias) => `SELECT false`,
  })
  isLiked: boolean;
}
