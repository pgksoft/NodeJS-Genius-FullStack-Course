import TEntityMutationResult from '../../app-infrastructure/api/types/t-entity-mutation-result'
import getEntityMutationError from '../../app-infrastructure/app-helpers/entity-mutation-result-response/helpers/get-entity-mutation-error'
import { TTasks } from '../entity/task-dto'
import taskStore from '../task-store/task-store'

const removeTask = (id: number): TEntityMutationResult<TTasks> => {
  const isFoundTask = taskStore.tasks.some((task) => task.id === id)
  if (!isFoundTask) {
    return getEntityMutationError(401)
  }
  const tempTasks = taskStore.tasks.filter((item) => {
    return item.id !== id
  })
  taskStore.tasks = [...tempTasks]
  const statusCode = 204
  return { isSuccess: true, code: statusCode, data: taskStore.tasks }
}

export default removeTask
