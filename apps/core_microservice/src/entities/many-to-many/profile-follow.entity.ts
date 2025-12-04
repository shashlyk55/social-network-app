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
import { User } from '../user.entity';

@Entity('profiles_follows', { schema: 'main' })
@Check('"follower_profile_id" != "followed_profile_id"')
export class ProfileFollow {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  accepted: boolean;

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
  updatedById: number;

  // @ManyToOne(() => User, { nullable: true })
  // @JoinColumn({ name: 'updated_by' })
  // updatedBy: User;

  @ManyToOne(() => Profile, (profile) => profile.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_profile_id' })
  followerProfile: Profile;

  @ManyToOne(() => Profile, (profile) => profile.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followed_profile_id' })
  followedProfile: Profile;
}
