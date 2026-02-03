import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { taskStatusFieldsSchema } from '@domain/tasks/inner-entities/task-status-dic/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiTaskStatusDicSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  TaskStatus: getOpenApiSchema(
    taskStatusFieldsSchema,
    { mode: 'all' },
    { ...openApiSchemaEntityMember, createBy: { $ref: '#/components/schemas/UserCrypt' } },
  ),
  TaskStatusDto: getOpenApiSchema(taskStatusFieldsSchema, {
    mode: 'exclude',
    keys: ['createBy', 'mutationDate'],
  }),
  TaskStatusDic: {
    type: 'array',
    items: { $ref: '#/components/schemas/TaskStatus' },
  },
};
