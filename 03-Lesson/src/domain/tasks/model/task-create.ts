import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeSqliteError } from '../../../db/analyze-sqlite-error'
import { getDb } from '../../../db/sqlite'
import { ITask, TTaskDto } from '../entity'
import { getTask } from '../helpers/get-task'
import { invalidateTaskListCache } from './task-list'

export async function taskCreate(
  taskTDto: TTaskDto,
): Promise<TEntityMutationResult<ITask>> {
  try {
    const db = await getDb()
    const result = await db.run(
      'INSERT INTO tasks (text) VALUES (?)',
      taskTDto.text,
    )
    if (result.lastID) {
      const crudResult = await getTask(result.lastID)
      if (crudResult.isSuccess) {
        return getCrudResultSuccess(crudResult.data, crudResult.code)
      }
      return getCrudResultError(crudResult.code)
    }
    return getCrudResultError(400)
  } catch (e) {
    return analyzeSqliteError(e)
  }
}
