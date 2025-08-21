import { Types } from 'mongoose'
import { TaskModel, TTask, TTaskDto } from '../model'
import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'

export async function taskUpdate(
  id: string,
  taskDto: TTaskDto,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const task = await TaskModel.findByIdAndUpdate(id, taskDto, {
      new: true,
      runValidators: true,
    }).lean()
    if (!task) {
      return getCrudResultError(404)
    }
    return getCrudResultSuccess(200, task)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
