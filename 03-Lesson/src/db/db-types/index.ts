import getEnumNames from '../../app-infrastructure/app-helpers/get-enum-names'
import TypeGuard, {
  TUnknownRecord,
} from '../../app-infrastructure/app-helpers/type-guard'

interface ISqliteError extends Error {
  errno?: number
  code?: string
}

enum SqliteErrorCode {
  SQLITE_CONSTRAINT,
  SQLITE_BUSY,
  SQLITE_MISMATCH,
  SQLITE_RANGE,
}

type TSqliteErrorCode = keyof typeof SqliteErrorCode

export const isTSqliteErrorCode: TypeGuard<TSqliteErrorCode> = (
  value,
): value is TSqliteErrorCode => {
  return getEnumNames(SqliteErrorCode).some((element) => {
    return element === value
  })
}

export const isISqliteError: TypeGuard<ISqliteError> = (
  value,
): value is ISqliteError => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'errno' in value &&
    typeof (value as TUnknownRecord).errno === 'number' &&
    'code' in value &&
    typeof (value as TUnknownRecord).code === 'string'
  )
}
