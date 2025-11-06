import { SaveDrawHistoryUseCase } from './SaveDrawHistoryUseCase';
import { DrawRepository } from '../../domain/repositories/DrawRepository';
import { Draw } from '../../domain/entities/Draw';

describe('SaveDrawHistoryUseCase', () => {
  let useCase: SaveDrawHistoryUseCase;
  let mockRepository: jest.Mocked<DrawRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findByContestNumber: jest.fn(),
      count: jest.fn()
    };

    useCase = new SaveDrawHistoryUseCase(mockRepository);
  });

  it('deve salvar um novo sorteio', async () => {
    mockRepository.findByContestNumber.mockResolvedValue(null);

    const input = {
      contestNumber: 3000,
      date: '2024-01-01',
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    };

    const result = await useCase.execute(input);

    expect(result).toBeInstanceOf(Draw);
    expect(result.contestNumber).toBe(3000);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByContestNumber).toHaveBeenCalledWith(3000);
  });

  it('deve lançar erro se o sorteio já existe', async () => {
    const existingDraw = Draw.create(
      3000,
      new Date('2024-01-01'),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    );

    mockRepository.findByContestNumber.mockResolvedValue(existingDraw);

    const input = {
      contestNumber: 3000,
      date: '2024-01-01',
      numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Sorteio 3000 já está cadastrado'
    );

    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('deve lançar erro se os números forem inválidos', async () => {
    mockRepository.findByContestNumber.mockResolvedValue(null);

    const input = {
      contestNumber: 3000,
      date: '2024-01-01',
      numbers: [1, 2, 3, 4, 5] // menos de 15 números
    };

    await expect(useCase.execute(input)).rejects.toThrow();
  });
});
