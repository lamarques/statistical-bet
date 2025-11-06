import { Router } from 'express';
import { SaveDrawController } from '../controllers/SaveDrawController';
import { GetBetSuggestionController } from '../controllers/GetBetSuggestionController';
import { ImportDrawsController } from '../controllers/ImportDrawsController';
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
  const importDrawsController = new ImportDrawsController();

  /**
   * @swagger
   * /api/draws:
   *   post:
   *     tags:
   *       - Sorteios
   *     summary: Salvar resultado de sorteio
   *     description: Adiciona um novo sorteio ao histórico para análise estatística
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - contestNumber
   *               - date
   *               - numbers
   *             properties:
   *               contestNumber:
   *                 type: integer
   *                 description: Número do concurso
   *                 example: 3200
   *               date:
   *                 type: string
   *                 format: date
   *                 description: Data do sorteio (YYYY-MM-DD)
   *                 example: "2024-11-05"
   *               numbers:
   *                 type: array
   *                 description: Array com 15 números únicos entre 1 e 25
   *                 minItems: 15
   *                 maxItems: 15
   *                 items:
   *                   type: integer
   *                   minimum: 1
   *                   maximum: 25
   *                 example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
   *     responses:
   *       201:
   *         description: Sorteio salvo com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Sorteio salvo com sucesso
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: draw-3200
   *                     contestNumber:
   *                       type: integer
   *                       example: 3200
   *                     date:
   *                       type: string
   *                       format: date-time
   *                       example: "2024-11-05T00:00:00.000Z"
   *                     numbers:
   *                       type: array
   *                       items:
   *                         type: integer
   *                       example: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Campos obrigatórios: contestNumber, date, numbers"
   *       409:
   *         description: Sorteio já cadastrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Sorteio 3200 já está cadastrado"
   */
  router.post('/draws', (req, res) => saveDrawController.handle(req, res));

  /**
   * @swagger
   * /api/suggestions:
   *   get:
   *     tags:
   *       - Apostas
   *     summary: Gerar sugestão de aposta
   *     description: |
   *       Gera uma sugestão de aposta baseada em análise estatística do histórico de sorteios.
   *       
   *       O algoritmo considera:
   *       - Frequência de aparição dos números (60% do score)
   *       - Tempo desde a última aparição (40% do score)
   *       - Balanceamento entre pares e ímpares
   *       - Balanceamento entre números baixos (1-13) e altos (14-25)
   *     responses:
   *       200:
   *         description: Sugestão gerada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Sugestão de aposta gerada com sucesso
   *                 data:
   *                   type: object
   *                   properties:
   *                     bet:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           example: bet-1730822400000
   *                         numbers:
   *                           type: array
   *                           description: 15 números sugeridos (ordenados)
   *                           items:
   *                             type: integer
   *                           example: [1, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 19, 22, 24, 25]
   *                         generatedAt:
   *                           type: string
   *                           format: date-time
   *                           example: "2024-11-05T12:00:00.000Z"
   *                     analysis:
   *                       type: object
   *                       properties:
   *                         totalDrawsAnalyzed:
   *                           type: integer
   *                           description: Quantidade de sorteios analisados
   *                           example: 10
   *                         frequencyBased:
   *                           type: array
   *                           description: Top 10 números mais frequentes
   *                           items:
   *                             type: integer
   *                           example: [3, 4, 5, 6, 8, 10, 17, 2, 7, 9]
   *                         delayedNumbers:
   *                           type: array
   *                           description: Top 10 números mais atrasados
   *                           items:
   *                             type: integer
   *                           example: [1, 5, 7, 9, 12, 15, 19, 22, 24, 25]
   *                         balancedSelection:
   *                           type: string
   *                           description: Descrição do balanceamento dos números
   *                           example: "Pares: 7, Ímpares: 8, Baixos(1-13): 10, Altos(14-25): 5"
   *       404:
   *         description: Sem histórico de sorteios
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Não há histórico de sorteios para gerar sugestões
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Erro ao processar sugestão
   */
  router.get('/suggestions', (req, res) => getBetSuggestionController.handle(req, res));

  /**
   * @swagger
   * /api/draws/import:
   *   post:
   *     tags:
   *       - Sorteios
   *     summary: Importar resultados da API da Caixa
   *     description: |
   *       Importa resultados automaticamente da API oficial da Caixa Econômica Federal.
   *       
   *       **Funcionalidades:**
   *       - Busca os últimos N sorteios da lotofácil
   *       - Não duplica registros existentes
   *       - Converte automaticamente os formatos
   *       - Retorna estatísticas da importação
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               count:
   *                 type: integer
   *                 description: Quantidade de sorteios a importar (1-1000)
   *                 default: 50
   *                 minimum: 1
   *                 maximum: 1000
   *                 example: 100
   *     responses:
   *       200:
   *         description: Importação concluída com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Importação concluída
   *                 data:
   *                   type: object
   *                   properties:
   *                     requested:
   *                       type: integer
   *                       example: 100
   *                     fetched:
   *                       type: integer
   *                       example: 100
   *                     saved:
   *                       type: integer
   *                       example: 95
   *                     skipped:
   *                       type: integer
   *                       example: 5
   *                     errors:
   *                       type: integer
   *                       example: 0
   *                     totalInDatabase:
   *                       type: integer
   *                       example: 120
   *       400:
   *         description: Parâmetro inválido
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "O campo count deve ser um número entre 1 e 1000"
   *       500:
   *         description: Erro ao importar
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: Erro ao conectar com a API da Caixa
   */
  router.post('/draws/import', (req, res) => importDrawsController.handle(req, res));

  return router;
}
