import { Request, Response } from 'express';
import { LotofacilApiService } from '../../infrastructure/services/LotofacilApiService';
import { JsonDrawRepository } from '../../infrastructure/repositories/JsonDrawRepository';
import { Draw } from '../../domain/entities/Draw';

export class ImportDrawsController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const { count = 50 } = req.body;

      if (typeof count !== 'number' || count < 1 || count > 1000) {
        return res.status(400).json({
          error: 'O campo count deve ser um número entre 1 e 1000'
        });
      }

      const apiService = new LotofacilApiService();
      const repository = new JsonDrawRepository();

      // Buscar sorteios da API
      const draws = await apiService.fetchLastNDraws(count);

      let saved = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const apiDraw of draws) {
        try {
          // Verificar se já existe
          const existing = await repository.findByContestNumber(apiDraw.numero);
          
          if (existing) {
            skipped++;
            continue;
          }

          // Converter strings para números
          const numbers = apiDraw.listaDezenas.map(n => parseInt(n));

          // Converter data do formato DD/MM/YYYY para Date
          const [day, month, year] = apiDraw.dataApuracao.split('/');
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

          // Criar e salvar
          const draw = Draw.create(apiDraw.numero, date, numbers);
          await repository.save(draw);
          saved++;
        } catch (error: any) {
          errors.push(`Sorteio ${apiDraw.numero}: ${error.message}`);
        }
      }

      const total = await repository.count();

      return res.status(200).json({
        message: 'Importação concluída',
        data: {
          requested: count,
          fetched: draws.length,
          saved,
          skipped,
          errors: errors.length,
          totalInDatabase: total
        },
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
