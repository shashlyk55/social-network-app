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
import { User } from '../user.entity';
import { ProfileConfiguration } from '../profile-configuration.entity';

@Entity('profiles_to_profiles_configurations', { schema: 'main' })
export class ProfileToProfileConfiguration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.profileConfigurations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({ name: 'profile_configuration_id' })
  profileConfigurationId: number;

  @ManyToOne(
    () => ProfileConfiguration,
    (config) => config.profileToProfileConfigurations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'profile_configuration_id' })
  profileConfiguration: ProfileConfiguration;

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
}
