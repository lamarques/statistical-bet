import { DrawRepository } from '../../domain/repositories/DrawRepository';
import { Bet } from '../../domain/entities/Bet';
import { StatisticsService } from '../services/StatisticsService';

export interface GenerateBetSuggestionOutput {
  bet: Bet;
  statistics: {
    totalDrawsAnalyzed: number;
    frequencyBased: number[];
    delayedNumbers: number[];
    balancedSelection: string;
  };
}

export class GenerateBetSuggestionUseCase {
  constructor(
    private readonly drawRepository: DrawRepository,
    private readonly statisticsService: StatisticsService
  ) {}

  async execute(): Promise<GenerateBetSuggestionOutput> {
    const draws = await this.drawRepository.findAll();

    if (draws.length === 0) {
      throw new Error('Não há histórico de sorteios para gerar sugestões');
    }

    // Calcular estatísticas
    const frequency = this.statisticsService.calculateFrequency(draws);
    const lastOccurrence = this.statisticsService.calculateLastOccurrence(draws);
    const pairFrequency = this.statisticsService.calculatePairFrequency(draws);
    const evenOddRatio = this.statisticsService.calculateEvenOddRatio(draws);
    const lowHighRatio = this.statisticsService.calculateLowHighRatio(draws);

    // Estratégia de geração de números
    const selectedNumbers = this.generateBalancedBet(
      frequency,
      lastOccurrence,
      evenOddRatio,
      lowHighRatio
    );

    const bet = Bet.create(selectedNumbers, {
      frequency,
      lastOccurrence,
      pairFrequency,
      evenOddRatio,
      lowHighRatio
    });

    return {
      bet,
      statistics: {
        totalDrawsAnalyzed: draws.length,
        frequencyBased: this.statisticsService.getTopNumbers(frequency, 10),
        delayedNumbers: this.statisticsService.getDelayedNumbers(lastOccurrence, 10),
        balancedSelection: this.getBalanceDescription(selectedNumbers)
      }
    };
  }

  private generateBalancedBet(
    frequency: Map<number, number>,
    lastOccurrence: Map<number, number>,
    evenOddRatio: { even: number; odd: number },
    lowHighRatio: { low: number; high: number }
  ): number[] {
    const selectedNumbers: number[] = [];
    const candidates = new Map<number, number>();

    // Calcular score para cada número
    for (let i = 1; i <= 25; i++) {
      const freq = frequency.get(i) || 0;
      const delay = lastOccurrence.get(i) || 0;
      
      // Score baseado em frequência normalizada e atraso
      const maxFreq = Math.max(...Array.from(frequency.values()));
      const maxDelay = Math.max(...Array.from(lastOccurrence.values()));
      
      const freqScore = maxFreq > 0 ? (freq / maxFreq) * 0.6 : 0;
      const delayScore = maxDelay > 0 ? (delay / maxDelay) * 0.4 : 0;
      
      candidates.set(i, freqScore + delayScore);
    }

    // Ordenar candidatos por score
    const sortedCandidates = Array.from(candidates.entries())
      .sort((a, b) => b[1] - a[1]);

    // Calcular quantidades ideais
    const targetEven = Math.round(15 * evenOddRatio.even);
    const targetOdd = 15 - targetEven;
    const targetLow = Math.round(15 * lowHighRatio.low);
    const targetHigh = 15 - targetLow;

    let evenCount = 0;
    let oddCount = 0;
    let lowCount = 0;
    let highCount = 0;

    // Selecionar números mantendo balanço
    for (const [num] of sortedCandidates) {
      if (selectedNumbers.length >= 15) break;

      const isEven = num % 2 === 0;
      const isLow = num <= 13;

      // Verificar se adicionar esse número mantém o balanço
      if (isEven && evenCount >= targetEven + 2) continue;
      if (!isEven && oddCount >= targetOdd + 2) continue;
      if (isLow && lowCount >= targetLow + 2) continue;
      if (!isLow && highCount >= targetHigh + 2) continue;

      selectedNumbers.push(num);
      if (isEven) evenCount++;
      else oddCount++;
      if (isLow) lowCount++;
      else highCount++;
    }

    // Se não tiver 15 números, completar com os melhores candidatos restantes
    if (selectedNumbers.length < 15) {
      for (const [num] of sortedCandidates) {
        if (selectedNumbers.length >= 15) break;
        if (!selectedNumbers.includes(num)) {
          selectedNumbers.push(num);
        }
      }
    }

    return selectedNumbers.sort((a, b) => a - b).slice(0, 15);
  }

  private getBalanceDescription(numbers: number[]): string {
    const even = numbers.filter(n => n % 2 === 0).length;
    const odd = numbers.length - even;
    const low = numbers.filter(n => n <= 13).length;
    const high = numbers.length - low;

    return `Pares: ${even}, Ímpares: ${odd}, Baixos(1-13): ${low}, Altos(14-25): ${high}`;
  }
}
