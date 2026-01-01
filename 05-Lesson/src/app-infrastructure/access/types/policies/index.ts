import type { TEntityNameKey } from '@infra/app-entities/app-entity-types/t-entity-name-key';
import type { TEntityPolicy } from '../entity-policies.ts';

export type TPolicies = Partial<Record<TEntityNameKey, TEntityPolicy>>;
