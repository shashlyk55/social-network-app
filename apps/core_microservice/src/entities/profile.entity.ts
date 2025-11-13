import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ProfileFollow } from './many-to-many/profile-follow.entity';
import { ProfileToProfileConfiguration } from './many-to-many/profile-to-profile-configuration.entity';
import { Post } from './post.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdById: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedById: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @Column({ default: false })
  deleted: boolean;

  @OneToMany(() => Post, (post) => post.profile)
  posts: Post[];

  @OneToMany(() => ProfileFollow, (follow) => follow.followerProfile)
  following: ProfileFollow[];

  @OneToMany(() => ProfileFollow, (follow) => follow.followedProfile)
  followers: ProfileFollow[];

  @OneToMany(() => ProfileToProfileConfiguration, (config) => config.profile)
  profileConfigurations: ProfileToProfileConfiguration[];
}
