import { Request, Response } from 'express';
import { GenerateBetSuggestionUseCase } from '../../application/use-cases/GenerateBetSuggestionUseCase';

export class GetBetSuggestionController {
  constructor(
    private readonly generateBetSuggestionUseCase: GenerateBetSuggestionUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.generateBetSuggestionUseCase.execute();

      return res.status(200).json({
        message: 'Sugestão de aposta gerada com sucesso',
        data: {
          bet: result.bet.toJSON(),
          analysis: result.statistics
        }
      });
    } catch (error: any) {
      if (error.message.includes('Não há histórico')) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: error.message });
    }
  }
}
