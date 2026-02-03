import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import { TaskStatusModel, type TTaskStatus } from '../model';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '@helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';

export async function taskStatusRemove(
  id: string,
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TTaskStatus>> {
  try {
    const task = await TaskStatusModel.findByIdAndDelete({ _id: id, ...filter }).lean();
    if (!task) {
      return getCrudResultError(404);
    }
    return getCrudResultSuccess(task, 204);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
