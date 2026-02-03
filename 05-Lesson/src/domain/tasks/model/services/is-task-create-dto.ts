import type TypeGuard from '@infra/app-type-helpers/type-guard';
import type { TTaskCreateDto } from '..';
import { isTaskUpdateDto } from './is-task-update-dto';

export const isTaskCreateDto: TypeGuard<TTaskCreateDto> = (value): value is TTaskCreateDto => {
  return (
    isTaskUpdateDto(value) &&
    'taskStatusEventId' in value &&
    typeof value.taskStatusEventId === 'string' &&
    (!('comment' in value) || ('comment' in value && typeof value.comment === 'string'))
  );
};
