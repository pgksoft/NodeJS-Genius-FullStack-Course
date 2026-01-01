import type { OpenAPIV3 } from 'openapi-types';

export const openApiSchemaEntityMember: Record<string, OpenAPIV3.SchemaObject> = {
  _id: { type: 'string', description: 'MongoDB autocomplete' },
  __v: { type: 'number', description: 'MongoDB autocomplete' },
};
