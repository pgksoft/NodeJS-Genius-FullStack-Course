import isEntityMember from '../../../app-infrastructure/api/api-helpers/is-entity-member'
import IEntityMember from '../../../app-infrastructure/api/types/i-entity-member'
import { TEntityRecord } from '../../../app-infrastructure/api/types/t-entity-data'
import isArrayOfTypePredicate from '../../../app-infrastructure/app-helpers/is-array-of-type-predicate'
import TypeGuard from '../../../app-infrastructure/app-helpers/type-guard'

export interface ITask extends IEntityMember {
  text: string
}
export type TTasks = ITask[]

export type TTaskDto = Omit<ITask, 'id'>

// helpers
export const isTaskDto: TypeGuard<TTaskDto> = (value): value is TTaskDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'text' in value &&
    typeof (value as TEntityRecord).text === 'string'
  )
}

export const isTask: TypeGuard<ITask> = (value): value is ITask => {
  return isEntityMember(value) && isTaskDto(value)
}

export const isTasks = isArrayOfTypePredicate(isTask)
