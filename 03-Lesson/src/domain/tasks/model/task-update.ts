import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeSqliteError } from '../../../db/analyze-sqlite-error'
import { getDb } from '../../../db/sqlite'
import { ITask, TTaskDto } from '../entity'
import { getTask } from '../helpers/get-task'

export async function taskUpdate(
  id: number,
  taskTDto: TTaskDto,
): Promise<TEntityMutationResult<ITask>> {
  try {
    const db = await getDb()
    const result = await db.run(
      'UPDATE tasks SET text = ? WHERE id = ?',
      taskTDto.text,
      id,
    )
    const isChanged = (result.changes && result.changes > 0) || false
    if (isChanged) {
      const crudResult = await getTask(id)
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
