import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ProfileToProfileConfiguration } from './many-to-many/profile-to-profile-configuration.entity';

@Entity('profile_configurations', { schema: 'main' })
export class ProfileConfiguration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'config_key', length: 100 })
  configKey: string;

  @Column({ name: 'is_admin_accessible_only', default: false })
  isAdminAccessibleOnly: boolean;

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

  @OneToMany(
    () => ProfileToProfileConfiguration,
    (config) => config.profileConfiguration,
  )
  profileToProfileConfigurations: ProfileToProfileConfiguration[];
}
