import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Account } from './account.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users', { schema: 'auth' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  disabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdById: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy: User | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedById: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User | null;

  //@Column({ name: 'account_id' })
  @RelationId((user: User) => user.account)
  accountId: number;

  @OneToOne(() => Account, (account) => account.user)
  account: Account;

  @Column({ type: 'int', name: 'profile_id', nullable: true })
  profileId: number | null;

  // @OneToOne(() => Profile, (profile) => profile.user)
  // profile: Profile;

  @OneToMany(() => User, (user) => user.createdBy)
  createdUsers: User[];

  @OneToMany(() => User, (user) => user.updatedBy)
  updatedUsers: User[];

  // Audit Log relations
  // @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  // auditLogs: AuditLog[];

  // @OneToMany(() => AuditLog, (auditLog) => auditLog.createdByUser)
  // createdAuditLogs: AuditLog[];

  // @OneToMany(() => AuditLog, (auditLog) => auditLog.updatedByUser)
  // updatedAuditLogs: AuditLog[];
}
