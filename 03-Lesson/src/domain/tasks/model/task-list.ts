import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeSqliteError } from '../../../db/analyze-sqlite-error'
import { getDb } from '../../../db/sqlite'
import { isTasks, TTasks } from '../entity'

let taskListCash: TTasks | null = null

export const taskList = async (): Promise<TEntityMutationResult<TTasks>> => {
  if (taskListCash) return getCrudResultSuccess<TTasks>(taskListCash)

  try {
    const db = await getDb()
    const tasks = await db.all('SELECT * from tasks ORDER BY id')
    if (isTasks(tasks)) {
      taskListCash = tasks
      return getCrudResultSuccess<TTasks>(taskListCash)
    }
    return getCrudResultError(600)
  } catch (e) {
    return analyzeSqliteError(e)
  }
}

export const invalidateTaskListCache = () => {
  taskListCash = null
}
