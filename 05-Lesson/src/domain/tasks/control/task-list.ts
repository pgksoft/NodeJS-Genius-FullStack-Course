import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import {
  TaskModel,
  type TApiTask,
  type TApiTasks,
  type TTaskPopulated,
  type TTaskSchema,
} from '../model';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import { taskPopulateConfig, taskSerializationRules } from '../const/serialization&populate-config';

export async function taskList(filter: TUnknownRecord): Promise<TEntityMutationResult<TApiTasks>> {
  try {
    const apiTasks = await listPopulateAndSerialize<
      TTaskPopulated,
      typeof taskSerializationRules,
      TApiTask,
      TTaskSchema
    >(TaskModel, filter, taskSerializationRules, taskPopulateConfig);
    return getCrudResultSuccess(apiTasks);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
