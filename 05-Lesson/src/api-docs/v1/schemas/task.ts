import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { taskFieldsSchema } from '@domain/tasks/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiTaskSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  Task: getOpenApiSchema(
    taskFieldsSchema,
    { mode: 'all' },
    { ...openApiSchemaEntityMember, createBy: { $ref: '#/components/schemas/UserCrypt' } },
  ),
  TaskList: {
    type: 'array',
    items: { $ref: '#/components/schemas/Task' },
  },
  TaskDto: getOpenApiSchema(taskFieldsSchema, { mode: 'exclude', keys: ['createBy'] }),
};
