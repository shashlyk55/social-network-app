import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { Profile } from '../profile.entity';

@Entity()
export class ProfileFollow {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;

  @Column({ default: false })
  isMuted: boolean;

  @Column({ default: false })
  isCloseFriend: boolean;

  @CreateDateColumn()
  followedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.following, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followerId' })
  follower: Profile;

  @ManyToOne(() => Profile, (profile) => profile.followers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followingId' })
  following: Profile;
}
