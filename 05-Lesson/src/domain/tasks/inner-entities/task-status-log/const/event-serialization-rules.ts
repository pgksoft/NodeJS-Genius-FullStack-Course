import type { RulesFor } from '@serialization/dsl-types';
import type { TTaskStatusEventPopulated } from '../model';
import { userSerializationRules } from '@domain/users/const/serialization';
import { taskStatusSerializationRules } from '../../task-status-dic/const/serialization&populate-config';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';

// for selected task
export const taskStatusEventSerializationRules: RulesFor<TTaskStatusEventPopulated> = {
  taskId: { kind: 'objectId' },
  taskStatusId: { kind: 'entityOf', rules: taskStatusSerializationRules },
  startDate: { kind: 'date' },
  endDate: { kind: 'date' },
  createBy: {
    kind: 'entityOf',
    rules: userSerializationRules,
  },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const taskStatusEventPopulateConfig = buildPopulateConfigFromRules(
  taskStatusEventSerializationRules,
);
