import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isProd = process.env.NODE_ENV === 'development';
const baseDir = isProd ? 'dist' : 'src';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [path.join(baseDir, 'entities', '*.{ts,js}')],
  migrations: [path.join(baseDir, 'database', 'migrations', '*.{ts,js}')],
});

export default AppDataSource;
