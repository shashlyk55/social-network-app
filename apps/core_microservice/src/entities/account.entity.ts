import {
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Entity,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;

  @Column({
    type: 'enum',
    enum: ['local', 'google', 'facebook'],
    default: 'local',
  })
  provider: string;

  @Column({ nullable: true })
  providerId: string;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.account)
  @JoinColumn()
  user: User;
}
