import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { CommentLike } from './many-to-many/comment-like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  authorId: number;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  author: User;

  @Column()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  post: Post;

  @Column({ default: 0 })
  likesCount: number;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  commentLikes: CommentLike[];
}
