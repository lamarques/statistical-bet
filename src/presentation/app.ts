import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { createRouter } from './routes';
import { swaggerSpec } from './swagger';

export function createApp(): Express {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Lotofácil API Docs'
  }));

  // Rota de health check
  /**
   * @swagger
   * /health:
   *   get:
   *     tags:
   *       - Sistema
   *     summary: Verifica o status da API
   *     description: Retorna o status de funcionamento da API
   *     responses:
   *       200:
   *         description: API funcionando corretamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   *                 service:
   *                   type: string
   *                   example: Lotofácil Bet Generator
   */
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'Lotofácil Bet Generator' });
  });

  // Rotas da aplicação
  app.use('/api', createRouter());

  // Tratamento de rota não encontrada
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  return app;
}
