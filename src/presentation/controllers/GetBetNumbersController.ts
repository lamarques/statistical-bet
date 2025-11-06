import { Request, Response } from 'express';
import { GenerateBetSuggestionUseCase } from '../../application/use-cases/GenerateBetSuggestionUseCase';

export class GetBetNumbersController {
  constructor(
    private readonly generateBetSuggestionUseCase: GenerateBetSuggestionUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.generateBetSuggestionUseCase.execute();
      const numbers = result.bet.numbers.getNumbers();

      return res.status(200).json({
        numbers: numbers.sort((a, b) => a - b)
      });
    } catch (error: any) {
      if (error.message.includes('Não há histórico')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: error.message });
    }
  }
}
