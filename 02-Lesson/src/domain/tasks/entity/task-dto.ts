import isEntityMember from '../../app-infrastructure/api/helpers/is-entity-member'
import { TEntityRecord } from '../../app-infrastructure/api/types/t-entity-data'
import TypeGuard from '../../app-infrastructure/app-helpers/type-guard/type-guard'

export type TTask = { id: number; text: string }
export type TTasks = TTask[]

export type TTaskDto = Omit<TTask, 'id'>

// helpers
export const isTaskDto: TypeGuard<TTaskDto> = (value): value is TTaskDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'text' in value &&
    typeof (value as TEntityRecord).text === 'string'
  )
}

export const isTask: TypeGuard<TTask> = (value): value is TTask => {
  return isEntityMember(value) && isTaskDto(value)
}
