import type { RulesFor } from '@serialization/dsl-types';
import { userSerializationRules } from '@domain/users/const/serialization';
import type { TTaskPopulated } from '../model';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';
import { taskStatusEventSerializationRules } from '../inner-entities/task-status-log/const/event-serialization-rules';

export const taskSerializationRules: RulesFor<TTaskPopulated> = {
  taskStatusEventId: { kind: 'entityOf', rules: taskStatusEventSerializationRules },
  createBy: {
    kind: 'entityOf',
    rules: userSerializationRules,
  },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const taskPopulateConfig = buildPopulateConfigFromRules(taskSerializationRules);
