import type { OpenAPIV3 } from 'openapi-types';
import type { Options } from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';
import '@sys/@types/swagger-jsdoc';
import { openApiTaskSchemas } from '@src/api-docs/v1/schemas/task';
import { openApiUserSchemas } from '@src/api-docs/v1/schemas/user';
import { openApiMediaLibrarySchemas } from '@src/api-docs/v1/schemas/media-library';

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
      schemas: { ...openApiTaskSchemas, ...openApiUserSchemas, ...openApiMediaLibrarySchemas },
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
