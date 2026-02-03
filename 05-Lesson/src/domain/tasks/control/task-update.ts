import type { Types } from 'mongoose';
import type { TApiTask, TTaskCreateDto, TTaskPopulated, TTaskSchema } from '../model';
import { TaskModel } from '../model';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { updatePopulateAndSerialize } from '@db/populate-&-serialize';
import { taskPopulateConfig, taskSerializationRules } from '../const/serialization&populate-config';

export async function taskUpdate(
  id: string,
  taskUpdateDto: TTaskCreateDto,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TApiTask>> {
  try {
    const apiTask = await updatePopulateAndSerialize<
      TTaskPopulated,
      typeof taskSerializationRules,
      TApiTask,
      TTaskSchema
    >(
      TaskModel,
      id,
      {
        ...taskUpdateDto,
        createBy: userID,
      },
      taskSerializationRules,
      taskPopulateConfig,
    );

    if (!apiTask) return getCrudResultError(464);
    return getCrudResultSuccess(apiTask);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
