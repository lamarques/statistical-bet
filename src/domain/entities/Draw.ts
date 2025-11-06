import { LotofacilNumbers } from '../value-objects/LotofacilNumbers';

export class Draw {
  constructor(
    public readonly id: string,
    public readonly contestNumber: number,
    public readonly date: Date,
    public readonly numbers: LotofacilNumbers
  ) {}

  static create(contestNumber: number, date: Date, numbers: number[]): Draw {
    const id = `draw-${contestNumber}`;
    const lotofacilNumbers = new LotofacilNumbers(numbers);
    return new Draw(id, contestNumber, date, lotofacilNumbers);
  }

  toJSON() {
    return {
      id: this.id,
      contestNumber: this.contestNumber,
      date: this.date.toISOString(),
      numbers: this.numbers.getNumbers()
    };
  }
}
