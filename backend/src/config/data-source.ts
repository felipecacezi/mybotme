import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/User.entity';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const baseDir = isProd ? 'dist' : 'src';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [path.join(baseDir, 'entities', '*.{ts,js}')],
  migrations: [path.join(baseDir, 'database', 'migrations', '*.{ts,js}')],
};

const AppDataSource = new DataSource(config);
export default AppDataSource;
