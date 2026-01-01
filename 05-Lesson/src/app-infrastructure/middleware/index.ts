import bodyParser from 'body-parser';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { requestLogger } from './request-logger';
import { extractUser } from './extract-user';
import { apiUnAuthUrl } from '@api/const/api-url';
import { swaggerSpecV1 } from '@infra/swagger';
import '@sys/@types/swagger-ui-express';

export const applyMiddleware = (app: Express) => {
  app.use(bodyParser.json());
  app.use(extractUser);
  app.use(requestLogger);
  app.use(apiUnAuthUrl.apiDocsV1, swaggerUi.serve, swaggerUi.setup(swaggerSpecV1));
};
