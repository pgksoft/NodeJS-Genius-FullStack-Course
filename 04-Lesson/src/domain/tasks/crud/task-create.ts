import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { TTask, TTaskDto, TaskModel } from '../model'

export async function taskCreate(
  taskDto: TTaskDto,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const document = await TaskModel.create({
      text: taskDto.text,
      isCompleted: taskDto.isCompleted,
    })
    const task: TTask = document.toObject()
    return getCrudResultSuccess(201, task)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
