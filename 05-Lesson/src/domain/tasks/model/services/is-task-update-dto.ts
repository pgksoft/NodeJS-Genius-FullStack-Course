import type TypeGuard from '@infra/app-type-helpers/type-guard';
import type { TTaskUpdateDto } from '..';
import type { TEntityRecord } from '@infra/app-entities/app-entity-types/t-entity-data';

export const isTaskUpdateDto: TypeGuard<TTaskUpdateDto> = (value): value is TTaskUpdateDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'description' in value &&
    typeof (value as TEntityRecord).description === 'string' &&
    (!('completed' in value) ||
      ('completed' in value && typeof (value as TEntityRecord).completed === 'boolean'))
  );
};
