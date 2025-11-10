import type { TEntityNameKey } from '@infra/app-entities/app-entity-types/t-entity-name-key';
import type { TEntityPolicy } from '../entity-policies.ts';
import { taskPolicy } from '@domain/tasks/policy';

export type TPolicies = Partial<Record<TEntityNameKey, TEntityPolicy>>;

export const policies: TPolicies = { task: taskPolicy };
