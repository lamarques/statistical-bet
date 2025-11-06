import { DrawRepository } from '../../domain/repositories/DrawRepository';
import { Draw } from '../../domain/entities/Draw';

export interface SaveDrawHistoryInput {
  contestNumber: number;
  date: string;
  numbers: number[];
}

export class SaveDrawHistoryUseCase {
  constructor(private readonly drawRepository: DrawRepository) {}

  async execute(input: SaveDrawHistoryInput): Promise<Draw> {
    const existing = await this.drawRepository.findByContestNumber(input.contestNumber);
    
    if (existing) {
      throw new Error(`Sorteio ${input.contestNumber} já está cadastrado`);
    }

    const draw = Draw.create(
      input.contestNumber,
      new Date(input.date),
      input.numbers
    );

    await this.drawRepository.save(draw);
    
    return draw;
  }
}
