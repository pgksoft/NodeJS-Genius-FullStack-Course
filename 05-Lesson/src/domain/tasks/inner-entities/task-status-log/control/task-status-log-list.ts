import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import {
  TaskStatusLogModel,
  type TApiTaskStatusLog,
  type TApiTaskStatusLogList,
  type TTaskStatusEventSchema,
  type TTaskStatusLogPopulated,
} from '../model';
import { getCrudResultSuccess } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  taskStatusLogPopulateConfig,
  taskStatusLogSerializationRules,
} from '../const/log-serialization-rules';

// for log
export async function taskStatusLogList(
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiTaskStatusLogList>> {
  try {
    const taskStatusLog = await listPopulateAndSerialize<
      TTaskStatusLogPopulated,
      typeof taskStatusLogSerializationRules,
      TApiTaskStatusLog,
      TTaskStatusEventSchema
    >(TaskStatusLogModel, filter, taskStatusLogSerializationRules, taskStatusLogPopulateConfig);
    return getCrudResultSuccess(taskStatusLog);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
