import { Router } from 'express';
import { SaveDrawController } from '../controllers/SaveDrawController';
import { GetBetSuggestionController } from '../controllers/GetBetSuggestionController';
import { SaveDrawHistoryUseCase } from '../../application/use-cases/SaveDrawHistoryUseCase';
import { GenerateBetSuggestionUseCase } from '../../application/use-cases/GenerateBetSuggestionUseCase';
import { StatisticsService } from '../../application/services/StatisticsService';
import { JsonDrawRepository } from '../../infrastructure/repositories/JsonDrawRepository';

export function createRouter(): Router {
  const router = Router();

  // Inicializar dependências
  const drawRepository = new JsonDrawRepository();
  const statisticsService = new StatisticsService();

  // Use Cases
  const saveDrawHistoryUseCase = new SaveDrawHistoryUseCase(drawRepository);
  const generateBetSuggestionUseCase = new GenerateBetSuggestionUseCase(
    drawRepository,
    statisticsService
  );

  // Controllers
  const saveDrawController = new SaveDrawController(saveDrawHistoryUseCase);
  const getBetSuggestionController = new GetBetSuggestionController(
    generateBetSuggestionUseCase
  );

  // Rotas
  router.post('/draws', (req, res) => saveDrawController.handle(req, res));
  router.get('/suggestions', (req, res) => getBetSuggestionController.handle(req, res));

  return router;
}
