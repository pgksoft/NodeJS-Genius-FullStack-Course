import { TEntityMutationError } from '../../app-infrastructure/api/types/t-entity-mutation-result'
import { getCrudResultError } from '../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { isISqliteError, isTSqliteErrorCode } from '../db-types'

export function analyzeSqliteError(e: unknown): TEntityMutationError {
  if (isISqliteError(e)) {
    if (isTSqliteErrorCode(e.code)) {
      return getCrudResultError(409, e.message)
    }
    return getCrudResultError(400, e.message)
  }
  return getCrudResultError(500, (e as Error).message || 'Unknown error')
}
