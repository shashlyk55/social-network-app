import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Profile } from '../profile.entity';

export enum FollowStatusFilter {
  ACCEPTED = 'accepted',
  PENDING = 'pending',
  ALL = 'all',
}

export enum FollowDirection {
  FOLLOWING = 'following',
  FOLLOWERS = 'followers',
}

@Entity('profiles_follows', { schema: 'main' })
@Check('"follower_profile_id" != "followed_profile_id"')
export class ProfileFollow {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'boolean' })
  accepted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;

  @Column({ type: 'int', name: 'follower_profile_id' })
  followerProfileId: number;

  @ManyToOne(() => Profile, (profile) => profile.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_profile_id' })
  followerProfile: Profile;

  @Column({ type: 'int', name: 'followed_profile_id' })
  followedProfileId: number;

  @ManyToOne(() => Profile, (profile) => profile.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followed_profile_id' })
  followedProfile: Profile;
}
