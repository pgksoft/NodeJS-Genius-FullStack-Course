import { defaultEntityActionPolicy } from '@access/const';
import type { TEntityPolicy } from '@access/entity-policies.ts';

export const taskPolicy: TEntityPolicy = {
  readOne: defaultEntityActionPolicy,
  readList: defaultEntityActionPolicy,
  create: defaultEntityActionPolicy,
  update: defaultEntityActionPolicy,
  delete: defaultEntityActionPolicy,
};
