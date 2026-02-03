import { logger } from '@logger/index';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import { TaskStatusLogModel } from '../inner-entities/task-status-log/model';
import type { TTask } from '../model';
import { TaskModel } from '../model';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import { Types } from 'mongoose';

export async function taskRemove(
  id: string,
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const task = await TaskModel.findByIdAndDelete({ _id: id, ...filter }).lean();
    if (!task) {
      return getCrudResultError(404);
    }
    const result = await TaskStatusLogModel.deleteMany({ taskId: new Types.ObjectId(id) });
    logger.info({ resultDeletedLog: result }, `task ${id} remove`);
    return getCrudResultSuccess(task, 204);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
