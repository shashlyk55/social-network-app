import { Account } from '../entities/account.entity';
import { User } from '../entities/user.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres_user',
  password: process.env.POSTGRES_PASSWORD || '123',
  database: process.env.POSTGRES_PASSWORD || 'innogram_db',
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true' ? true : false,
  schema: process.env.POSTGRES_SCHEMA || 'auth',
  logging: true,
  entities: [User, Account],
});
