import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TTasks } from '../model';
import { TaskModel } from '../model';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

export async function taskList(filter: TUnknownRecord): Promise<TEntityMutationResult<TTasks>> {
  try {
    const tasks = await TaskModel.find(filter).lean();
    return getCrudResultSuccess(tasks);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
