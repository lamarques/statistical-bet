import { Request, Response } from 'express';
import { SaveDrawHistoryUseCase } from '../../application/use-cases/SaveDrawHistoryUseCase';

export class SaveDrawController {
  constructor(private readonly saveDrawHistoryUseCase: SaveDrawHistoryUseCase) {}

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { contestNumber, date, numbers } = req.body;

      if (!contestNumber || !date || !numbers) {
        return res.status(400).json({
          error: 'Campos obrigatórios: contestNumber, date, numbers'
        });
      }

      if (!Array.isArray(numbers) || numbers.length !== 15) {
        return res.status(400).json({
          error: 'O campo numbers deve ser um array com 15 números'
        });
      }

      const draw = await this.saveDrawHistoryUseCase.execute({
        contestNumber,
        date,
        numbers
      });

      return res.status(201).json({
        message: 'Sorteio salvo com sucesso',
        data: draw.toJSON()
      });
    } catch (error: any) {
      if (error.message.includes('já está cadastrado')) {
        return res.status(409).json({ error: error.message });
      }

      return res.status(400).json({ error: error.message });
    }
  }
}
