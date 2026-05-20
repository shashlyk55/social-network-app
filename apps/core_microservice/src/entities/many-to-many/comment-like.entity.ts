import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from '../profile.entity';
import { Comment } from '../comment.entity';

@Entity('comments_likes', { schema: 'main' })
export class CommentLike {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'comment_id' })
  commentId: number;

  @ManyToOne(() => Comment, (comment) => comment.commentLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;

  @Column({ type: 'int', name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;
}
