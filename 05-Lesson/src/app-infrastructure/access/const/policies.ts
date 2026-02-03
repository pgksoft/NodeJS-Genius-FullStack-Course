import type { TPolicies } from '@access/types/policies';
import { mediaLibraryPolicy } from '@domain/media-library/policy';
import { taskStatusPolicy } from '@domain/tasks/inner-entities/task-status-dic/policy';
import { taskStatusLogPolicy } from '@domain/tasks/inner-entities/task-status-log/policy';
import { taskPolicy } from '@domain/tasks/policy';
import { userPolicy } from '@domain/users/policy';

export const policies: TPolicies = {
  task: taskPolicy,
  taskStatusLog: taskStatusLogPolicy,
  taskStatusDic: taskStatusPolicy,
  user: userPolicy,
  mediaLibrary: mediaLibraryPolicy,
};
