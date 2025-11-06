import { LotofacilNumbers } from '../value-objects/LotofacilNumbers';

export interface BetStatistics {
  frequency: Map<number, number>;
  lastOccurrence: Map<number, number>;
  pairFrequency: Map<string, number>;
  evenOddRatio: { even: number; odd: number };
  lowHighRatio: { low: number; high: number };
}

export class Bet {
  constructor(
    public readonly id: string,
    public readonly numbers: LotofacilNumbers,
    public readonly generatedAt: Date,
    public readonly statistics?: BetStatistics
  ) {}

  static create(numbers: number[], statistics?: BetStatistics): Bet {
    const id = `bet-${Date.now()}`;
    const lotofacilNumbers = new LotofacilNumbers(numbers);
    return new Bet(id, lotofacilNumbers, new Date(), statistics);
  }

  toJSON() {
    return {
      id: this.id,
      numbers: this.numbers.getNumbers(),
      generatedAt: this.generatedAt.toISOString(),
      statistics: this.statistics
    };
  }
}
