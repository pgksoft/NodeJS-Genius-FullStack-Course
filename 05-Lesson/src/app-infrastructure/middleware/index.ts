import bodyParser from 'body-parser';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { requestLogger } from './request-logger';
import { extractUser } from './extract-user';
import { apiUnAuthUrl } from '@api/const/api-url';
import { swaggerSpec } from '@src/api-docs/swagger';
import '@sys/@types/swagger-ui-express';

export const applyMiddleware = (app: Express) => {
  app.use(bodyParser.json());
  app.use(extractUser);
  app.use(requestLogger);
  app.use(apiUnAuthUrl.apiDocs, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
