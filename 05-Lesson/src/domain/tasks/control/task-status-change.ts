import { analyzeMongoError } from '@db/analyze-mongo-error';
import { taskChangeStatusService, type TInputParams } from './services/task-change-status-service';
import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import type { TApiTask } from '../model';

export const taskChangeStatus = async (
  params: TInputParams,
): Promise<TEntityMutationResult<TApiTask>> => {
  try {
    return await taskChangeStatusService(params);
  } catch (e) {
    return analyzeMongoError(e);
  }
};
