import { Draw } from '../entities/Draw';

export interface DrawRepository {
  save(draw: Draw): Promise<void>;
  findAll(): Promise<Draw[]>;
  findByContestNumber(contestNumber: number): Promise<Draw | null>;
  count(): Promise<number>;
}
