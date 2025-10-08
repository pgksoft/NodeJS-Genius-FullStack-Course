import type { TTask, TTaskDto } from '../model';
import { TaskModel } from '../model';
import type TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';

export async function taskUpdate(
  id: string,
  taskDto: TTaskDto,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const task = await TaskModel.findByIdAndUpdate(id, taskDto, {
      new: true,
      runValidators: true,
    }).lean();
    if (!task) {
      return getCrudResultError(404);
    }
    return getCrudResultSuccess(task);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
