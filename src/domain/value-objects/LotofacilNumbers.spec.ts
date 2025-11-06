import { LotofacilNumbers } from '../../domain/value-objects/LotofacilNumbers';

describe('LotofacilNumbers', () => {
  describe('constructor', () => {
    it('deve criar números válidos da Lotofácil', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const lotofacilNumbers = new LotofacilNumbers(numbers);

      expect(lotofacilNumbers.getNumbers()).toEqual(numbers);
    });

    it('deve ordenar os números automaticamente', () => {
      const numbers = [15, 3, 7, 1, 12, 5, 9, 2, 14, 6, 11, 4, 13, 8, 10];
      const lotofacilNumbers = new LotofacilNumbers(numbers);

      expect(lotofacilNumbers.getNumbers()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('deve lançar erro se não tiver exatamente 15 números', () => {
      const numbers = [1, 2, 3, 4, 5];

      expect(() => new LotofacilNumbers(numbers)).toThrow(
        'Lotofácil deve ter exatamente 15 números'
      );
    });

    it('deve lançar erro se houver números duplicados', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 14];

      expect(() => new LotofacilNumbers(numbers)).toThrow(
        'Os números devem ser únicos'
      );
    });

    it('deve lançar erro se houver números fora do intervalo 1-25', () => {
      const numbers = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

      expect(() => new LotofacilNumbers(numbers)).toThrow(
        'Números devem estar entre 1 e 25'
      );

      const numbersAbove = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 26];

      expect(() => new LotofacilNumbers(numbersAbove)).toThrow(
        'Números devem estar entre 1 e 25'
      );
    });
  });

  describe('contains', () => {
    it('deve retornar true se o número está presente', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const lotofacilNumbers = new LotofacilNumbers(numbers);

      expect(lotofacilNumbers.contains(5)).toBe(true);
    });

    it('deve retornar false se o número não está presente', () => {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const lotofacilNumbers = new LotofacilNumbers(numbers);

      expect(lotofacilNumbers.contains(20)).toBe(false);
    });
  });

  describe('equals', () => {
    it('deve retornar true para números iguais', () => {
      const numbers1 = new LotofacilNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      const numbers2 = new LotofacilNumbers([15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);

      expect(numbers1.equals(numbers2)).toBe(true);
    });

    it('deve retornar false para números diferentes', () => {
      const numbers1 = new LotofacilNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      const numbers2 = new LotofacilNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16]);

      expect(numbers1.equals(numbers2)).toBe(false);
    });
  });
});
