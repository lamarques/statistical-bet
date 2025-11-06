import { GenerateBetSuggestionUseCase } from './GenerateBetSuggestionUseCase';
import { DrawRepository } from '../../domain/repositories/DrawRepository';
import { StatisticsService } from '../services/StatisticsService';
import { Draw } from '../../domain/entities/Draw';

describe('GenerateBetSuggestionUseCase', () => {
  let useCase: GenerateBetSuggestionUseCase;
  let mockRepository: jest.Mocked<DrawRepository>;
  let statisticsService: StatisticsService;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByContestNumber: jest.fn(),
      count: jest.fn()
    };

    statisticsService = new StatisticsService();
    useCase = new GenerateBetSuggestionUseCase(mockRepository, statisticsService);
  });

  it('deve gerar uma sugestão de aposta válida', async () => {
    const mockDraws = [
      Draw.create(1, new Date('2024-01-01'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
      Draw.create(2, new Date('2024-01-02'), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
      Draw.create(3, new Date('2024-01-03'), [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 24, 25, 16]),
      Draw.create(4, new Date('2024-01-04'), [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 25, 1, 3])
    ];

    mockRepository.findAll.mockResolvedValue(mockDraws);

    const result = await useCase.execute();

    expect(result.bet.numbers.getNumbers()).toHaveLength(15);
    expect(result.statistics.totalDrawsAnalyzed).toBe(4);
    expect(result.statistics.frequencyBased).toHaveLength(10);
    expect(result.statistics.delayedNumbers).toHaveLength(10);
    expect(result.statistics.balancedSelection).toContain('Pares');
    expect(result.statistics.balancedSelection).toContain('Ímpares');
  });

  it('deve lançar erro se não houver histórico de sorteios', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    await expect(useCase.execute()).rejects.toThrow(
      'Não há histórico de sorteios para gerar sugestões'
    );
  });

  it('deve gerar números únicos e válidos', async () => {
    const mockDraws = [
      Draw.create(1, new Date('2024-01-01'), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]),
      Draw.create(2, new Date('2024-01-02'), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
    ];

    mockRepository.findAll.mockResolvedValue(mockDraws);

    const result = await useCase.execute();
    const numbers = result.bet.numbers.getNumbers();

    // Verificar se todos são únicos
    const uniqueNumbers = new Set(numbers);
    expect(uniqueNumbers.size).toBe(15);

    // Verificar se estão no intervalo válido
    for (const num of numbers) {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(25);
    }

    // Verificar se estão ordenados
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    expect(numbers).toEqual(sortedNumbers);
  });
});
