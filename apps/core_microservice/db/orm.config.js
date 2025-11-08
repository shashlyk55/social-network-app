import { config as dotenvConfig } from 'dotenv';
import { DataSource } from 'typeorm';

dotenvConfig({ path: 'core.env' });

const dataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'social_network',
  schema: process.env.POSTGRES_SCHEMA,
  entities: ['entities/*.entity{.ts,.js}'],
  migrations: ['migrations/*{.ts,.js}'],
  synchronize: Boolean(process.env.POSTGRES_SYNCHRONIZE),
  logging: Boolean(process.env.POSTGRES_LOGGING),
  migrationsRun: process.env.NODE_ENV === 'production',
};

export default new DataSource(dataSourceOptions);
