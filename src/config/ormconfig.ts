import dotenv from 'dotenv';
import { DataSourceOptions, DataSource } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: (process.env.TYPE as any) ?? 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) ?? 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  synchronize: false,
  bigNumberStrings: true,
  multipleStatements: true,
  logging: ['error', 'schema', 'migration', 'warn'],
  entities: ['**/*.entity{ .ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsRun: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;