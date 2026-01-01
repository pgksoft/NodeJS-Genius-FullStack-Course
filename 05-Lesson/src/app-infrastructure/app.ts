import type { Express } from 'express';
import express from 'express';
import { applyMiddleware } from './middleware';
import { applyRoutes } from './app-routes';

export const createApp = (): Express => {
  const app = express();
  applyMiddleware(app);
  applyRoutes(app);
  return app;
};
