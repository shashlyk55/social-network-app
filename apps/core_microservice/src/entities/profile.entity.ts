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
  VirtualColumn,
} from 'typeorm';
import { ProfileFollow } from './many-to-many/profile-follow.entity';
import { ProfileToProfileConfiguration } from './many-to-many/profile-to-profile-configuration.entity';
import { Post } from './post.entity';

@Entity('profiles', { schema: 'main' })
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column({ name: 'display_name' })
  displayName: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', name: 'avatar_url', nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;

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

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."profiles_follows" WHERE "followed_profile_id" = ${alias}.id`,
  })
  followersCount: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."profiles_follows" WHERE "follower_profile_id" = ${alias}.id`,
  })
  followedCount: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."posts" WHERE "profile_id" = ${alias}.id`,
  })
  postsCount: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT("id") FROM "main"."posts" WHERE "profile_id" = ${alias}.id AND "is_archived" = false`,
  })
  publicPostsCount: number;

  @VirtualColumn({
    query: (alias) => `SELECT false`,
  })
  isFollowed: boolean;
}
