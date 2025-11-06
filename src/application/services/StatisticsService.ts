import { Draw } from '../../domain/entities/Draw';

export class StatisticsService {
  calculateFrequency(draws: Draw[]): Map<number, number> {
    const frequency = new Map<number, number>();
    
    for (let i = 1; i <= 25; i++) {
      frequency.set(i, 0);
    }

    for (const draw of draws) {
      for (const num of draw.numbers.getNumbers()) {
        frequency.set(num, (frequency.get(num) || 0) + 1);
      }
    }

    return frequency;
  }

  calculateLastOccurrence(draws: Draw[]): Map<number, number> {
    const lastOccurrence = new Map<number, number>();
    
    for (let i = 1; i <= 25; i++) {
      lastOccurrence.set(i, draws.length);
    }

    for (let i = draws.length - 1; i >= 0; i--) {
      for (const num of draws[i].numbers.getNumbers()) {
        if (lastOccurrence.get(num) === draws.length) {
          lastOccurrence.set(num, draws.length - i - 1);
        }
      }
    }

    return lastOccurrence;
  }

  calculatePairFrequency(draws: Draw[]): Map<string, number> {
    const pairFrequency = new Map<string, number>();

    for (const draw of draws) {
      const numbers = draw.numbers.getNumbers();
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          const pair = `${numbers[i]}-${numbers[j]}`;
          pairFrequency.set(pair, (pairFrequency.get(pair) || 0) + 1);
        }
      }
    }

    return pairFrequency;
  }

  calculateEvenOddRatio(draws: Draw[]): { even: number; odd: number } {
    let totalEven = 0;
    let totalOdd = 0;

    for (const draw of draws) {
      for (const num of draw.numbers.getNumbers()) {
        if (num % 2 === 0) {
          totalEven++;
        } else {
          totalOdd++;
        }
      }
    }

    const total = totalEven + totalOdd;
    return {
      even: total > 0 ? totalEven / total : 0,
      odd: total > 0 ? totalOdd / total : 0
    };
  }

  calculateLowHighRatio(draws: Draw[]): { low: number; high: number } {
    let totalLow = 0;
    let totalHigh = 0;

    for (const draw of draws) {
      for (const num of draw.numbers.getNumbers()) {
        if (num <= 13) {
          totalLow++;
        } else {
          totalHigh++;
        }
      }
    }

    const total = totalLow + totalHigh;
    return {
      low: total > 0 ? totalLow / total : 0,
      high: total > 0 ? totalHigh / total : 0
    };
  }

  getTopNumbers(frequency: Map<number, number>, count: number): number[] {
    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([num]) => num);
  }

  getDelayedNumbers(lastOccurrence: Map<number, number>, count: number): number[] {
    return Array.from(lastOccurrence.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([num]) => num);
  }
}
