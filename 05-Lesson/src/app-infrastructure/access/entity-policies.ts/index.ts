import type { TEntityAction } from '@infra/app-entities/app-entity-types/t-entity-actions';
import type { TEntityActionPolicy } from '../entity-action-policy';

export type TEntityPolicy = Partial<Record<TEntityAction, TEntityActionPolicy>>;
