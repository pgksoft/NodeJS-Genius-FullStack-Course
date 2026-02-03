import type { TEntityNameKey } from '@infra/app-entities/app-entity-types/t-entity-name-key';

export const collectionNames: Record<TEntityNameKey, string> = {
  task: 'task',
  user: 'user',
  mediaLibrary: 'media-library',
  taskStatusDic: 'task-status-dic',
  taskStatusLog: 'task-status-log',
};
