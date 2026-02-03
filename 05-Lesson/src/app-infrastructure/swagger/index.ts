import type { OpenAPIV3 } from 'openapi-types';
import type { Options } from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';
import '@sys/@types/swagger-jsdoc';
import { openApiTaskSchemas } from '@api/api-docs/v1/schemas/tasks/task';
import { openApiUserSchemas } from '@api/api-docs/v1/schemas/user';
import { openApiMediaLibrarySchemas } from '@api/api-docs/v1/schemas/media-library';
import { openApiTaskStatusDicSchemas } from '@api/api-docs/v1/schemas/tasks/task-status-dic';
import { openApiTaskStatusLogSchemas } from '@api/api-docs/v1/schemas/tasks/task-status-log';

const optionsV1: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Educational project API',
      version: '1.0.0',
      description: 'API documentation for an educational project',
    },
    paths: {},
    components: {
      securitySchemes: { basicAuth: { type: 'http', scheme: 'basic' } },
      schemas: {
        ...openApiTaskSchemas,
        ...openApiTaskStatusDicSchemas,
        ...openApiTaskStatusLogSchemas,
        ...openApiUserSchemas,
        ...openApiMediaLibrarySchemas,
      },
    },
    security: [
      {
        basicAuth: [],
      },
    ],
  },
  apis: ['src/domain/**/routes/**/*.ts'],
};

export const swaggerSpecV1: OpenAPIV3.Document = swaggerJSDoc(optionsV1);
