import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { getDb } from '../../../db/sqlite'
import { ITask } from '../entity'
import { invalidateTaskListCache } from '../model/task-list'

export const getTask = async (
  id: number,
): Promise<TEntityMutationResult<ITask>> => {
  const db = await getDb()
  const newTask = await db.get<ITask>('SELECT * FROM tasks WHERE id = ?', id)
  if (newTask) {
    invalidateTaskListCache()
    return getCrudResultSuccess<ITask>(newTask, 201)
  }
  return getCrudResultError(600)
}
