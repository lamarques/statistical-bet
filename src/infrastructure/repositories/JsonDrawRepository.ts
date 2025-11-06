import * as fs from 'fs/promises';
import * as path from 'path';
import { DrawRepository } from '../../domain/repositories/DrawRepository';
import { Draw } from '../../domain/entities/Draw';
import { LotofacilNumbers } from '../../domain/value-objects/LotofacilNumbers';

interface DrawData {
  id: string;
  contestNumber: number;
  date: string;
  numbers: number[];
}

export class JsonDrawRepository implements DrawRepository {
  private readonly filePath: string;
  private cache: Draw[] | null = null;

  constructor(dataDir: string = './data') {
    this.filePath = path.join(dataDir, 'draws.json');
  }

  async save(draw: Draw): Promise<void> {
    const draws = await this.findAll();
    
    const existingIndex = draws.findIndex(d => d.contestNumber === draw.contestNumber);
    if (existingIndex >= 0) {
      draws[existingIndex] = draw;
    } else {
      draws.push(draw);
    }

    // Ordenar por número do concurso
    draws.sort((a, b) => a.contestNumber - b.contestNumber);

    await this.writeToFile(draws);
    this.cache = draws;
  }

  async findAll(): Promise<Draw[]> {
    if (this.cache) {
      return [...this.cache];
    }

    try {
      await fs.access(this.filePath);
      const data = await fs.readFile(this.filePath, 'utf-8');
      const drawsData: DrawData[] = JSON.parse(data);
      
      this.cache = drawsData.map(d => new Draw(
        d.id,
        d.contestNumber,
        new Date(d.date),
        new LotofacilNumbers(d.numbers)
      ));

      return [...this.cache];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async findByContestNumber(contestNumber: number): Promise<Draw | null> {
    const draws = await this.findAll();
    return draws.find(d => d.contestNumber === contestNumber) || null;
  }

  async count(): Promise<number> {
    const draws = await this.findAll();
    return draws.length;
  }

  private async writeToFile(draws: Draw[]): Promise<void> {
    const drawsData = draws.map(d => d.toJSON());
    const dir = path.dirname(this.filePath);
    
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }

    await fs.writeFile(this.filePath, JSON.stringify(drawsData, null, 2), 'utf-8');
  }

  clearCache(): void {
    this.cache = null;
  }
}
