import TEntityMutationResult from '../../app-infrastructure/api/types/t-entity-mutation-result'
import getEntityMutationError from '../../app-infrastructure/app-helpers/entity-mutation-result-response/helpers/get-entity-mutation-error'
import { isTaskDto, TTask } from '../entity/task-dto'
import taskStore from '../task-store/task-store'

const createTask = (body: unknown): TEntityMutationResult<TTask> => {
  const isMutationTask = isTaskDto(body)
  if (!isMutationTask) {
    return getEntityMutationError(400)
  }
  const nextId =
    taskStore.tasks.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1
  const newTask: TTask = { id: nextId, text: body.text }
  taskStore.tasks.push(newTask)
  const statusCode = 201
  return { isSuccess: true, code: statusCode, data: newTask }
}

export default createTask
