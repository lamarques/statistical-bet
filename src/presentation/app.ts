import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { createRouter } from './routes';

export function createApp(): Express {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Rota de health check
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
