import type { RulesFor } from '@serialization/dsl-types';
import type { TTaskStatusLogPopulated } from '../model';
import { userSerializationRules } from '@domain/users/const/serialization';
import { taskStatusSerializationRules } from '../../task-status-dic/const/serialization&populate-config';
import { taskSerializationRules } from '@domain/tasks/const/serialization&populate-config';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';

// for task list
export const taskStatusLogSerializationRules: RulesFor<TTaskStatusLogPopulated> = {
  taskId: { kind: 'entityOf', rules: taskSerializationRules },
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

export const taskStatusLogPopulateConfig = buildPopulateConfigFromRules(
  taskStatusLogSerializationRules,
);
