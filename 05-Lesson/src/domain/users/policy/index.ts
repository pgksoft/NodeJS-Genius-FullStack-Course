import { defaultEntityActionPolicy } from '@access/const/default-entity-action-policy';
import type { TEntityPolicy } from '@access/types/entity-policies.ts';

export const userPolicy: TEntityPolicy = { readList: defaultEntityActionPolicy };
