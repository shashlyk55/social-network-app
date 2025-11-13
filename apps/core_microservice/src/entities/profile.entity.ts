import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ProfileFollow } from './many-to-many/profile-follow.entity';
import { ProfileToProfileConfiguration } from './many-to-many/profile-to-profile-configuration.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarId: number;

  @Column()
  userId: number;

  @OneToOne(() => User, (user) => user.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  // Follow relationships
  @OneToMany(() => ProfileFollow, (follow) => follow.follower, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  following: ProfileFollow[];

  @OneToMany(() => ProfileFollow, (follow) => follow.following, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  followers: ProfileFollow[];

  // Privacy configurations
  @OneToMany(() => ProfileToProfileConfiguration, (config) => config.profile, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  profileConfigurations: ProfileToProfileConfiguration[];

  @OneToMany(
    () => ProfileToProfileConfiguration,
    (config) => config.targetProfile,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  targetProfileConfigurations: ProfileToProfileConfiguration[];
}
