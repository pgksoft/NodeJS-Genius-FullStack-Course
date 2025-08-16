import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeSqliteError } from '../../../db/analyze-sqlite-error'
import { getDb } from '../../../db/sqlite'
import APP_TITLE from '../../../app-infrastructure/const/app-title'
import { invalidateTaskListCache } from './task-list'

type TSuccessRemove = { id: number; message: string }

export async function taskRemove(
  id: number,
): Promise<TEntityMutationResult<TSuccessRemove>> {
  try {
    const db = await getDb()
    const result = await db.run('DELETE FROM tasks WHERE id = ?', id)
    const isChanged = (result.changes && result.changes > 0) || false
    if (isChanged) {
      invalidateTaskListCache()
      const code = 204
      return getCrudResultSuccess({ id, message: APP_TITLE[code] }, code)
    }
    return getCrudResultError(400)
  } catch (e) {
    return analyzeSqliteError(e)
  }
}
