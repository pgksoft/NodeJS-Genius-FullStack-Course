import type { Options } from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';
import '@sys/@types/swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Educational project API',
      version: '1.0.0',
      description: 'API documentation for an educational project',
    },
    paths: {},
  },
  apis: ['src/api/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
