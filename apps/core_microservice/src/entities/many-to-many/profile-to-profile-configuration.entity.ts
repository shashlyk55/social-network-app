import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../profile.entity';

@Entity()
export class ProfileToProfileConfiguration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  profileId: number;

  @Column()
  targetProfileId: number;

  @Column({ default: 'default' })
  visibility: string; // 'default', 'visible', 'hidden', 'blocked'

  @Column({ default: false })
  canSeePosts: boolean;

  @Column({ default: false })
  canSeeFriends: boolean;

  @Column({ default: false })
  canSendMessage: boolean;

  @Column({ default: false })
  canComment: boolean;

  @Column({ type: 'jsonb', nullable: true })
  customSettings: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Profile, (profile) => profile.profileConfigurations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ManyToOne(() => Profile, (profile) => profile.targetProfileConfigurations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'targetProfileId' })
  targetProfile: Profile;
}
