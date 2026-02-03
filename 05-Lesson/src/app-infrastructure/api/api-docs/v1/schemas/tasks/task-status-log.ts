import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { taskStatusEventFieldsSchema } from '@domain/tasks/inner-entities/task-status-log/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiTaskStatusLogSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  TaskStatusEvent: getOpenApiSchema(
    taskStatusEventFieldsSchema,
    { mode: 'all' },
    {
      ...openApiSchemaEntityMember,
      taskStatusId: { $ref: '#/components/schemas/TaskStatus' },
      createBy: { $ref: '#/components/schemas/UserCrypt' },
    },
  ),
  TaskStatusLog: getOpenApiSchema(
    taskStatusEventFieldsSchema,
    { mode: 'all' },
    {
      ...openApiSchemaEntityMember,
      taskId: { $ref: '#/components/schemas/Task' },
      taskStatusId: { $ref: '#/components/schemas/TaskStatus' },
      createBy: { $ref: '#/components/schemas/UserCrypt' },
    },
  ),
  TasksStatusLog: {
    type: 'array',
    items: { $ref: '#/components/schemas/TaskStatusLog' },
  },
};
