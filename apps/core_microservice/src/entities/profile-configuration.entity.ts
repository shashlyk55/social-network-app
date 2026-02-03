import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProfileToProfileConfiguration } from './many-to-many/profile-to-profile-configuration.entity';

@Entity('profile_configurations', { schema: 'main' })
export class ProfileConfiguration {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', name: 'config_key', length: 100 })
  configKey: string;

  @Column({ type: 'boolean', name: 'is_admin_accessible_only', default: false })
  isAdminAccessibleOnly: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'int', name: 'created_by' })
  createdById: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'int', name: 'updated_by', nullable: true })
  updatedById: number | null;

  @OneToMany(
    () => ProfileToProfileConfiguration,
    (config) => config.profileConfiguration,
  )
  profileToProfileConfigurations: ProfileToProfileConfiguration[];
}
