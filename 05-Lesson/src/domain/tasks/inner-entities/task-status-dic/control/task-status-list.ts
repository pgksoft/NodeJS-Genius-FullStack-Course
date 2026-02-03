import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import {
  TaskStatusModel,
  type TApiTaskStatus,
  type TApiTaskStatusDic,
  type TTaskStatusPopulated,
  type TTaskStatusSchema,
} from '../model';
import { getCrudResultSuccess } from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  taskStatusPopulateConfig,
  taskStatusSerializationRules,
} from '../const/serialization&populate-config';

export async function taskStatusList(
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiTaskStatusDic>> {
  try {
    const taskStatusList = await listPopulateAndSerialize<
      TTaskStatusPopulated,
      typeof taskStatusSerializationRules,
      TApiTaskStatus,
      TTaskStatusSchema
    >(TaskStatusModel, filter, taskStatusSerializationRules, taskStatusPopulateConfig);
    return getCrudResultSuccess(taskStatusList);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
