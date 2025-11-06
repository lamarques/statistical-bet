import { Draw } from '../../domain/entities/Draw';
import { StatisticsService } from './StatisticsService';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let mockDraws: Draw[];

  beforeEach(() => {
    service = new StatisticsService();
    
    // Criar draws mock
    mockDraws = [
      Draw.create(1, new Date('2024-01-01'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
      Draw.create(2, new Date('2024-01-02'), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
      Draw.create(3, new Date('2024-01-03'), [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24, 25, 16])
    ];
  });

  describe('calculateFrequency', () => {
    it('deve calcular a frequência de cada número', () => {
      const frequency = service.calculateFrequency(mockDraws);

      expect(frequency.get(1)).toBe(2);
      expect(frequency.get(2)).toBe(2);
      expect(frequency.get(3)).toBe(3);
      expect(frequency.get(16)).toBe(2);
      expect(frequency.get(18)).toBe(0);
    });

    it('deve inicializar todos os números de 1 a 25', () => {
      const frequency = service.calculateFrequency(mockDraws);

      expect(frequency.size).toBe(25);
      for (let i = 1; i <= 25; i++) {
        expect(frequency.has(i)).toBe(true);
      }
    });
  });

  describe('calculateLastOccurrence', () => {
    it('deve calcular quantos sorteios atrás cada número apareceu', () => {
      const lastOccurrence = service.calculateLastOccurrence(mockDraws);

      expect(lastOccurrence.get(1)).toBe(0); // apareceu no sorteio 3, último com o número 1
      expect(lastOccurrence.get(16)).toBe(0); // apareceu no último sorteio
      expect(lastOccurrence.get(25)).toBe(0); // apareceu no último sorteio
    });

    it('deve retornar o total de draws para números que nunca apareceram', () => {
      const lastOccurrence = service.calculateLastOccurrence(mockDraws);

      expect(lastOccurrence.get(18)).toBe(3);
      expect(lastOccurrence.get(20)).toBe(3);
      expect(lastOccurrence.get(22)).toBe(3);
    });
  });

  describe('calculateEvenOddRatio', () => {
    it('deve calcular a proporção de números pares e ímpares', () => {
      const ratio = service.calculateEvenOddRatio(mockDraws);

      expect(ratio.even).toBeGreaterThan(0);
      expect(ratio.odd).toBeGreaterThan(0);
      expect(ratio.even + ratio.odd).toBeCloseTo(1);
    });
  });

  describe('calculateLowHighRatio', () => {
    it('deve calcular a proporção de números baixos (1-13) e altos (14-25)', () => {
      const ratio = service.calculateLowHighRatio(mockDraws);

      expect(ratio.low).toBeGreaterThan(0);
      expect(ratio.high).toBeGreaterThan(0);
      expect(ratio.low + ratio.high).toBeCloseTo(1);
    });
  });

  describe('getTopNumbers', () => {
    it('deve retornar os números mais frequentes', () => {
      const frequency = service.calculateFrequency(mockDraws);
      const topNumbers = service.getTopNumbers(frequency, 5);

      expect(topNumbers.length).toBe(5);
      expect(topNumbers).toContain(3); // aparece 3 vezes
    });
  });

  describe('getDelayedNumbers', () => {
    it('deve retornar os números mais atrasados', () => {
      const lastOccurrence = service.calculateLastOccurrence(mockDraws);
      const delayedNumbers = service.getDelayedNumbers(lastOccurrence, 5);

      expect(delayedNumbers.length).toBe(5);
      // Números que nunca apareceram devem estar no topo
      const frequency = service.calculateFrequency(mockDraws);
      const neverAppeared = delayedNumbers.filter(n => frequency.get(n) === 0);
      expect(neverAppeared.length).toBeGreaterThan(0);
    });
  });
});
