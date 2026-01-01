import { openApiSchemaEntityMember } from '@db/open-api-schema-entity-member';
import { mediaFieldsSchema } from '@domain/media-library/model';
import { getOpenApiSchema } from '@helpers/get-open-api-schema';
import type { OpenAPIV3 } from 'openapi-types';

export const openApiMediaLibrarySchemas: Record<
  string,
  OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject
> = {
  MediaItem: getOpenApiSchema(
    mediaFieldsSchema,
    { mode: 'all' },
    { ...openApiSchemaEntityMember, createBy: { $ref: '#/components/schemas/UserCrypt' } },
  ),
  MediaItemList: {
    type: 'array',
    items: { $ref: '#/components/schemas/MediaItem' },
  },
  MediaDto: getOpenApiSchema(
    mediaFieldsSchema,
    { mode: 'exclude', keys: ['createBy', 'fileMeta'] },
    {
      file: {
        type: 'string',
        format: 'binary',
        description: 'Media file to upload',
      },
    },
    'override',
  ),
  MediaUpdateDto: getOpenApiSchema(
    mediaFieldsSchema,
    { mode: 'exclude', keys: ['createBy', 'fileMeta'] },
    {
      file: {
        type: 'string',
        format: 'binary',
        description: 'Media file to upload',
      },
    },
    'override',
    {
      requiredMode: 'none',
      anyOf: [
        { required: ['description'], description: 'Variant A: must provide a `description`' },
        { required: ['file'], description: 'Variant B: must provide a `file`' },
      ],
    },
  ),
};
