import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { User } from '../user.entity';
import { Comment } from '../comment.entity';

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  commentId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  likedAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
