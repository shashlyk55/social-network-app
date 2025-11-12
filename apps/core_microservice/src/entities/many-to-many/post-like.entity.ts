import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { User } from '../user.entity';
import { Post } from '../post.entity';

@Entity()
export class PostLike {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  postId: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    default: 'like',
  })
  reactionType: string;

  @CreateDateColumn()
  likedAt: Date;

  @ManyToOne(() => Post, (post) => post.postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @ManyToOne(() => User, (user) => user.postLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
