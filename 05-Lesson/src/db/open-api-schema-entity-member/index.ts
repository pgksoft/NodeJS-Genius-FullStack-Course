import { omitKeys } from '@helpers/omit-keys';
import type { TEntityMember } from '@infra/app-entities/app-entity-types/t-entity-member';
import type { OpenAPIV3 } from 'openapi-types';

type TKeyEntityMember = keyof TEntityMember;

export const schemaEntityMember: Record<TKeyEntityMember, OpenAPIV3.SchemaObject> = {
  _id: { type: 'string', description: 'MongoDB autocomplete' },
  __v: { type: 'number', description: 'MongoDB autocomplete' },
};

export const openApiSchemaEntityMember: Record<string, OpenAPIV3.SchemaObject> = omitKeys(
  schemaEntityMember,
  ['__v'],
);
