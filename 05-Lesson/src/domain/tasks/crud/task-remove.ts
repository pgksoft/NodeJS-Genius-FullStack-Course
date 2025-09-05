import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { TaskModel, TTask } from '../model'

export async function taskRemove(
  id: string,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const task = await TaskModel.findByIdAndDelete(id).lean()
    if (!task) {
      return getCrudResultError(404)
    }
    return getCrudResultSuccess(task, 204)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
