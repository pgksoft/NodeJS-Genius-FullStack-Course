import { Schema, model } from 'mongoose'
import { TEntityMember } from '../../../app-infrastructure/api/types/t-entity-memeber'
import TypeGuard from '../../../app-infrastructure/app-helpers/type-guard'
import { TEntityRecord } from '../../../app-infrastructure/api/types/t-entity-data'

export type TTask = {
  text: string
  isCompleted?: boolean
} & TEntityMember

export type TTasks = TTask[]

export type TTaskDto = Omit<TTask, '_id' | '__v'>

const taskSchema = new Schema<TTaskDto>({
  text: { type: 'string', required: true, unique: true },
  isCompleted: { type: 'boolean', default: false },
})

export const TaskModel = model<TTaskDto>('Task', taskSchema)

// helpers
export const isTaskDto: TypeGuard<TTaskDto> = (value): value is TTaskDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'text' in value &&
    typeof (value as TEntityRecord).text === 'string' &&
    (!('isCompleted' in value) ||
      ('isCompleted' in value &&
        typeof (value as TEntityRecord).isCompleted === 'boolean'))
  )
}
