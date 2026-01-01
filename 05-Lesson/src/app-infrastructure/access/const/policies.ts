import type { TPolicies } from '@access/types/policies';
import { mediaLibraryPolicy } from '@domain/media-library/policy';
import { taskPolicy } from '@domain/tasks/policy';
import { userPolicy } from '@domain/users/policy';

export const policies: TPolicies = {
  task: taskPolicy,
  user: userPolicy,
  mediaLibrary: mediaLibraryPolicy,
};
