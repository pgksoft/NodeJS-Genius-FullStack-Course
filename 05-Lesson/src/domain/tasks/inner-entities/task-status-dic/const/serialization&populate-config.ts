import type { RulesFor } from '@serialization/dsl-types';
import type { TTaskStatus, TTaskStatusPopulated } from '../model';
import { userSerializationRules } from '@domain/users/const/serialization';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';

export const taskStatusSerializationRules: RulesFor<TTaskStatusPopulated> = {
  mutationDate: { kind: 'date' },
  createBy: {
    kind: 'entityOf',
    rules: userSerializationRules,
  },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const taskStatusPopulateConfig = buildPopulateConfigFromRules(taskStatusSerializationRules);

export const taskStatusFlatSerializationRules: RulesFor<TTaskStatus> = {
  mutationDate: { kind: 'date' },
  createBy: { kind: 'objectId' },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;
