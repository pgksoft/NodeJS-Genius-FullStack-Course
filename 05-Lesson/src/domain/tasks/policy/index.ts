import { defaultEntityActionPolicy } from '@access/const/default-entity-action-policy';
import type { TEntityPolicy } from '@access/types/entity-policies.ts';

export const taskPolicy: TEntityPolicy = {
  readOne: defaultEntityActionPolicy,
  readList: defaultEntityActionPolicy,
  create: defaultEntityActionPolicy,
  update: defaultEntityActionPolicy,
  delete: defaultEntityActionPolicy,
  'task-change-status': defaultEntityActionPolicy,
};
