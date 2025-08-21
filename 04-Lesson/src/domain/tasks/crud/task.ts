import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { TaskModel, TTask } from '../model'

export async function task(id: string): Promise<TEntityMutationResult<TTask>> {
  try {
    const task = await TaskModel.findById(id).lean()
    if (!task) {
      return getCrudResultError(404)
    }
    return getCrudResultSuccess(200, task)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
