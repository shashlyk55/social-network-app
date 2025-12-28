import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { PostAsset } from './many-to-many/post-asset.entity';
import { PostLike } from './many-to-many/post-like.entity';
import { Profile } from './profile.entity';
import { Comment } from './comment.entity';

@Entity('posts', { schema: 'main' })
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

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

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostAsset, (postAsset) => postAsset.post)
  postAssets: PostAsset[];

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];
}
