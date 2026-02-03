import { defaultEntityActionPolicy } from '@access/const/default-entity-action-policy';
import type { TEntityPolicy } from '@access/types/entity-policies.ts';

export const taskStatusLogPolicy: TEntityPolicy = {
  readOne: defaultEntityActionPolicy,
  readList: defaultEntityActionPolicy,
};
