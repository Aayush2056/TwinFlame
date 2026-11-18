import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createApiRouter } from './routes/apiRoutes.js';

export function createExpressApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    cors({
      origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',').map((o) => o.trim()),
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));

  app.use('/api', createApiRouter());
  app.use('/api', notFoundHandler);
  app.use(errorHandler);

  return app;
}
