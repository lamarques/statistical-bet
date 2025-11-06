import { DrawRepository } from '../../domain/repositories/DrawRepository';
import { JsonDrawRepository } from './JsonDrawRepository';
import { MySQLDrawRepository } from './MySQLDrawRepository';

export class DrawRepositoryFactory {
  private static instance: DrawRepository | null = null;

  static getRepository(): DrawRepository {
    if (!DrawRepositoryFactory.instance) {
      // Use MySQL if DATABASE_HOST is configured, otherwise use JSON
      if (process.env.DATABASE_HOST) {
        console.log('📊 Usando MySQLDrawRepository');
        DrawRepositoryFactory.instance = new MySQLDrawRepository();
      } else {
        console.log('📁 Usando JsonDrawRepository');
        DrawRepositoryFactory.instance = new JsonDrawRepository();
      }
    }

    return DrawRepositoryFactory.instance;
  }

  // For testing purposes, allow reset
  static reset(): void {
    DrawRepositoryFactory.instance = null;
  }
}
