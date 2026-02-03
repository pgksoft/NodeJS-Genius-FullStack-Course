import type { Types } from 'mongoose';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TApiTask, TTaskCreateDto } from '../model';
import { taskCreateService } from './services/task-create-service';

export async function taskCreate(
  taskCreateDto: TTaskCreateDto,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TApiTask>> {
  try {
    return await taskCreateService(taskCreateDto, userID);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
