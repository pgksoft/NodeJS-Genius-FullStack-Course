import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TApiTask, TTaskPopulated, TTaskSchema } from '../model';
import { TaskModel } from '../model';
import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize';
import { taskPopulateConfig, taskSerializationRules } from '../const/serialization&populate-config';

export async function task(id: string): Promise<TEntityMutationResult<TApiTask>> {
  try {
    const task = await findByIdPopulateAndSerialize<
      TTaskPopulated,
      typeof taskSerializationRules,
      TApiTask,
      TTaskSchema
    >(TaskModel, id, taskSerializationRules, taskPopulateConfig);
    if (!task) {
      return getCrudResultError(404);
    }
    return getCrudResultSuccess(task);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
