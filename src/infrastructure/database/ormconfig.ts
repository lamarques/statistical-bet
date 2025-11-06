import { DataSource } from 'typeorm';
import { DrawEntity } from './entities/DrawEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER || 'lotofacil',
  password: process.env.DATABASE_PASSWORD || 'lotofacil123',
  database: process.env.DATABASE_NAME || 'lotofacil',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync schema in development
  logging: process.env.NODE_ENV === 'development',
  entities: [DrawEntity],
  migrations: ['dist/infrastructure/database/migrations/*.js'],
  subscribers: [],
  charset: 'utf8mb4',
  timezone: 'Z',
});

export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection established successfully');
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    throw error;
  }
}

export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed successfully');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
}
