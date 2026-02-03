import type { Types } from 'mongoose';
import {
  TaskStatusModel,
  type TApiTaskStatus,
  type TTaskStatusMutationDto,
  type TTaskStatusPopulated,
  type TTaskStatusSchema,
} from '../model';
import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { createPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  taskStatusPopulateConfig,
  taskStatusSerializationRules,
} from '../const/serialization&populate-config';

export const taskStatusCreate = async (
  taskStatusDto: TTaskStatusMutationDto,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TApiTaskStatus>> => {
  try {
    const apiTaskStatus = await createPopulateAndSerialize<
      TTaskStatusPopulated,
      typeof taskStatusSerializationRules,
      TApiTaskStatus, // API DTO
      TTaskStatusSchema // schema type
    >(
      TaskStatusModel,
      {
        ...taskStatusDto,
        mutationDate: new Date(),
        createBy: userID,
      },
      taskStatusSerializationRules,
      taskStatusPopulateConfig,
    );

    if (!apiTaskStatus) return getCrudResultError(464);
    return getCrudResultSuccess(apiTaskStatus, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
