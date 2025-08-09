import TEntityMutationResult from '../../app-infrastructure/api/types/t-entity-mutation-result'
import getEntityMutationError from '../../app-infrastructure/app-helpers/entity-mutation-result-response/helpers/get-entity-mutation-error'
import { isTaskDto, TTask } from '../entity/task-dto'
import taskStore from '../task-store/task-store'

type TUpdateTaskInputParams = { id: number; body: unknown }

const updateTask = (
  inputParams: TUpdateTaskInputParams,
): TEntityMutationResult<TTask> => {
  const { id, body } = inputParams
  const isMutationTask = isTaskDto(body)
  if (!isMutationTask) {
    return getEntityMutationError(400)
  }
  const updateTask = taskStore.tasks.find((task) => {
    return task.id === id
  })
  if (!updateTask) {
    return getEntityMutationError(401)
  }
  updateTask.text = body.text
  const statusCode = 201
  return { isSuccess: true, code: statusCode, data: updateTask }
}

export default updateTask
