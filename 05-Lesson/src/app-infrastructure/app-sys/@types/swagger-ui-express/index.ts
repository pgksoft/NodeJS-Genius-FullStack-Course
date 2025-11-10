declare module 'swagger-ui-express' {
  import type { RequestHandler } from 'express';

  // swaggerUi provides ready-made middleware
  export const serve: RequestHandler[];
  export function setup(
    swaggerDoc: object,
    options?: {
      explorer?: boolean;
      customCss?: string;
      customJs?: string;
      customfavIcon?: string;
      customSiteTitle?: string;
    },
  ): RequestHandler;
}
