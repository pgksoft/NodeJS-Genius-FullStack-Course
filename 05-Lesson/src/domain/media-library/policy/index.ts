import { defaultEntityActionPolicy } from '@access/const/default-entity-action-policy';
import type { TEntityPolicy } from '@access/types/entity-policies.ts';

export const mediaLibraryPolicy: TEntityPolicy = {
  readOne: defaultEntityActionPolicy,
  readList: defaultEntityActionPolicy,
  create: defaultEntityActionPolicy,
  update: defaultEntityActionPolicy,
  delete: defaultEntityActionPolicy,
};
