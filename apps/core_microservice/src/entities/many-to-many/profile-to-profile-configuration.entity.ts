import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Profile } from '../profile.entity';
import { ProfileConfiguration } from '../profile-configuration.entity';

export enum PrivacyValue {
  ALL = 'all',
  FOLLOWERS = 'followers',
  NONE = 'none',
}

@Entity('profiles_to_profiles_configurations', { schema: 'main' })
@Index(['profileId', 'profileConfigurationId'], { unique: true })
export class ProfileToProfileConfiguration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', name: 'profile_id' })
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.profileConfigurations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @Column({
    type: 'varchar',
    name: 'config_value',
    default: PrivacyValue.ALL,
  })
  configValue: PrivacyValue;

  @Column({ type: 'int', name: 'profile_configuration_id' })
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

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;
}
