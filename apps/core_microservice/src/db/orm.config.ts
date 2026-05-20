import { config as dotenvConfig } from 'dotenv';
//import { Chat } from '../entities/chat.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

dotenvConfig({ path: 'core.env' });

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'social_network',
  schema: process.env.POSTGRES_SCHEMA || 'main',
  //entities: ['**/entities/*.entity{.ts,.js}', Chat],
  entities: [join(process.cwd(), 'src/entities/**/*.entity{.ts,.js}')],
  //migrations: ['migrations/*{.ts,.js}'],
  migrations: [join(process.cwd(), 'src/db/migrations/*{.ts,.js}')],
  synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
  logging: process.env.POSTGRES_LOGGING === 'true',
};

console.log(config);

export default new DataSource(config);
