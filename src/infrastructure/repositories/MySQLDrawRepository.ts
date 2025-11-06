import { Repository } from 'typeorm';
import { DrawRepository } from '../../domain/repositories/DrawRepository';
import { Draw } from '../../domain/entities/Draw';
import { DrawEntity } from '../database/entities/DrawEntity';
import { AppDataSource } from '../database/ormconfig';

export class MySQLDrawRepository implements DrawRepository {
  private repository: Repository<DrawEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(DrawEntity);
  }

  async save(draw: Draw): Promise<void> {
    const entity = DrawEntity.fromDomain({
      contestNumber: draw.contestNumber,
      drawDate: draw.date,
      numbers: draw.numbers.getNumbers(),
    });

    await this.repository.save(entity);
  }

  async findAll(): Promise<Draw[]> {
    const entities = await this.repository.find({
      order: {
        contestNumber: 'ASC',
      },
    });

    return entities.map((entity: DrawEntity) => {
      const domain = entity.toDomain();
      return Draw.create(domain.contestNumber, domain.drawDate, domain.numbers);
    });
  }

  async findByContestNumber(contestNumber: number): Promise<Draw | null> {
    const entity = await this.repository.findOne({
      where: { contestNumber },
    });

    if (!entity) {
      return null;
    }

    const domain = entity.toDomain();
    return Draw.create(domain.contestNumber, domain.drawDate, domain.numbers);
  }

  async findLatest(): Promise<Draw | null> {
    const entity = await this.repository.findOne({
      order: {
        contestNumber: 'DESC',
      },
    });

    if (!entity) {
      return null;
    }

    const domain = entity.toDomain();
    return Draw.create(domain.contestNumber, domain.drawDate, domain.numbers);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async saveMany(draws: Draw[]): Promise<void> {
    const entities = draws.map(draw =>
      DrawEntity.fromDomain({
        contestNumber: draw.contestNumber,
        drawDate: draw.date,
        numbers: draw.numbers.getNumbers(),
      })
    );

    await this.repository.save(entities);
  }

  async deleteAll(): Promise<void> {
    await this.repository.clear();
  }
}
