import { Schema, model } from 'mongoose'
import { TEntityMember } from '../../../app-infrastructure/api/types/t-entity-member'
import TypeGuard from '../../../app-infrastructure/app-helpers/type-guard'
import { TEntityRecord } from '../../../app-infrastructure/api/types/t-entity-data'

export type TMedia = {
  description: String
  media?: String | null
} & TEntityMember

export type TMediaLibrary = TMedia[]

export type TMediaDto = Omit<TMedia, '_id' | '__v'>

const mediaSchema = new Schema<TMediaDto>({
  description: {
    type: String,
    required: [true, 'Description is required'],
    unique: true,
  },
  media: { type: String, default: null },
})

export const MediaModel = model<TMediaDto>('Media-Library', mediaSchema)

// helpers
export const isMediaDto: TypeGuard<TMediaDto> = (value): value is TMediaDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'description' in value &&
    typeof (value as TEntityRecord).description === 'string' &&
    (!('media' in value) ||
      ('media' in value && typeof (value as TEntityRecord).media === 'string'))
  )
}
