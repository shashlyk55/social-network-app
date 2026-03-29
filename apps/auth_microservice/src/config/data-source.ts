import path from 'path';
import * as dotenv from 'dotenv';

import { Account } from '../entities/account.entity';
import { User } from '../entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const envPath = path.join(__dirname, '..', '..', 'auth.env');
dotenv.config({ path: envPath });

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT!),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true' ? true : false,
  schema: process.env.POSTGRES_SCHEMA,
  logging: process.env.POSTGRES_LOGGING === 'true' ? true : false,
  entities: [User, Account],
};

console.log(options);

export const AppDataSource = new DataSource(options);
