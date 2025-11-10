import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TTask } from '../model';
import { TaskModel } from '../model';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

export async function taskRemove(
  id: string,
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const task = await TaskModel.findByIdAndDelete({ _id: id, ...filter }).lean();
    if (!task) {
      return getCrudResultError(404);
    }
    return getCrudResultSuccess(task, 204);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
