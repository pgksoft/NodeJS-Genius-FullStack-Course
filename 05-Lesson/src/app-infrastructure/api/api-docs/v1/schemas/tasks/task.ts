import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { taskStatusEventFieldsSchema } from '@domain/tasks/inner-entities/task-status-log/model';
import { taskFieldsSchema } from '@domain/tasks/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

const baseCreateDto = getOpenApiSchema(taskFieldsSchema, {
  mode: 'exclude',
  keys: ['createBy'],
});

export const openApiTaskSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  Task: getOpenApiSchema(
    taskFieldsSchema,
    { mode: 'all' },
    {
      ...openApiSchemaEntityMember,
      taskStatusEventId: { $ref: '#/components/schemas/TaskStatusEvent' },
      createBy: { $ref: '#/components/schemas/UserCrypt' },
    },
  ),
  TaskList: {
    type: 'array',
    items: { $ref: '#/components/schemas/Task' },
  },
  TaskCreateDto: {
    properties: {
      ...baseCreateDto.properties,
      comment: {
        type: 'string',
        maxLength: Number(taskStatusEventFieldsSchema.comment.maxLength?.toString()),
        description: taskStatusEventFieldsSchema.comment.openApi?.description,
      },
    },
    required: [...(baseCreateDto.required ?? []), 'comment'],
  },
  TaskUpdateDto: getOpenApiSchema(taskFieldsSchema, {
    mode: 'exclude',
    keys: ['taskStatusEventId', 'createBy'],
  }),
  TaskChangeStatusDto: getOpenApiSchema(taskStatusEventFieldsSchema, {
    mode: 'include',
    keys: ['taskStatusId', 'comment'],
  }),
};
