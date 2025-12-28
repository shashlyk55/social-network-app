import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from './user.entity';

export enum AccountProviderType {
  LOCAL = 'local',
  GOOGLE = 'google',
  // FACEBOOK = 'facebook',
  // GITHUB = 'github',
  // TWITTER = 'twitter',
}

@Entity('accounts', { schema: 'auth' })
export class Account {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password_hash', nullable: true })
  passwordHash: string | null;

  @Column({
    type: 'enum',
    enum: AccountProviderType,
    default: AccountProviderType.LOCAL,
  })
  provider: AccountProviderType;

  @Column({ name: 'provider_id', nullable: true })
  providerId: string;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by' })
  createdById: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedById: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @BeforeInsert()
  @BeforeUpdate()
  validateProviderData() {
    if (this.provider === AccountProviderType.LOCAL && !this.passwordHash) {
      throw new Error('Local provider accounts must have a password');
    }

    if (this.provider !== AccountProviderType.LOCAL && !this.providerId) {
      throw new Error('OAuth provider accounts must have a provider ID');
    }
  }
}
