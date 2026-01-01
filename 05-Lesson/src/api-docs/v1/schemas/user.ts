import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { userFieldsSchema } from '@domain/users/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiUserSchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  UserCrypt: getOpenApiSchema(
    userFieldsSchema,
    { mode: 'exclude', keys: ['password'] },
    openApiSchemaEntityMember,
  ),
  UserList: { type: 'array', items: { $ref: '#/components/schemas/UserCrypt' } },
  RegisterUser: getOpenApiSchema(userFieldsSchema, { mode: 'exclude', keys: ['role'] }),
  LoginUser: getOpenApiSchema(userFieldsSchema, { mode: 'include', keys: ['email', 'password'] }),
};
