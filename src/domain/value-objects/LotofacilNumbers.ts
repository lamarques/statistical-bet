// Domain Layer - Entities and Value Objects

export class LotofacilNumbers {
  private readonly numbers: number[];

  constructor(numbers: number[]) {
    this.validate(numbers);
    this.numbers = [...numbers].sort((a, b) => a - b);
  }

  private validate(numbers: number[]): void {
    if (numbers.length !== 15) {
      throw new Error('Lotofácil deve ter exatamente 15 números');
    }

    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== 15) {
      throw new Error('Os números devem ser únicos');
    }

    for (const num of numbers) {
      if (num < 1 || num > 25) {
        throw new Error('Números devem estar entre 1 e 25');
      }
    }
  }

  getNumbers(): number[] {
    return [...this.numbers];
  }

  contains(number: number): boolean {
    return this.numbers.includes(number);
  }

  equals(other: LotofacilNumbers): boolean {
    return JSON.stringify(this.numbers) === JSON.stringify(other.getNumbers());
  }
}
