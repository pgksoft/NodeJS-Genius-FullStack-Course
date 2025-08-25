import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { TaskModel, TTasks } from '../model'

export async function taskList(): Promise<TEntityMutationResult<TTasks>> {
  try {
    const tasks = await TaskModel.find().lean();
    return getCrudResultSuccess(200, tasks)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
