import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import {
  TaskStatusLogModel,
  type TApiTaskStatusEvent,
  type TApiTaskStatusEventLog,
  type TTaskStatusEventPopulated,
  type TTaskStatusEventSchema,
} from '../model';
import { getCrudResultSuccess } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  taskStatusEventPopulateConfig,
  taskStatusEventSerializationRules,
} from '../const/event-serialization-rules';

// for selected task
export async function taskStatusEventList(
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiTaskStatusEventLog>> {
  try {
    const taskStatusLog = await listPopulateAndSerialize<
      TTaskStatusEventPopulated,
      typeof taskStatusEventSerializationRules,
      TApiTaskStatusEvent,
      TTaskStatusEventSchema
    >(TaskStatusLogModel, filter, taskStatusEventSerializationRules, taskStatusEventPopulateConfig);
    return getCrudResultSuccess(taskStatusLog);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
