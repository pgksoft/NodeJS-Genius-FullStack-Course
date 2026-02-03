import type { TEntityNameKey } from '@infra/app-entities/app-entity-types/t-entity-name-key';

export const apiUnAuthUrl = {
  server: '/',
  apiDocsV1: '/api-docs/v1',
  userRegister: '/api/register-user',
  userLogin: '/api/login-user',
};

export const publicUrl = Object.values(apiUnAuthUrl);

type TAddEndpoint = 'image' | 'uploads';

const apiAuthUrl: Record<TEntityNameKey | TAddEndpoint, string> = {
  user: '/api/users',
  task: '/api/tasks',
  taskStatusLog: '/api/task-status-log',
  taskStatusDic: '/api/task-status-dic',
  image: '/api/image',
  mediaLibrary: '/api/media-library',
  uploads: '/uploads',
};

export default apiAuthUrl;
