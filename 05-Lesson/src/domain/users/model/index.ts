import { Schema, model } from 'mongoose'
import { TEntityMember } from '../../../app-infrastructure/api/types/t-entity-member'
import TypeGuard from '../../../app-infrastructure/app-helpers/type-guard'
import { TEntityRecord } from '../../../app-infrastructure/api/types/t-entity-data'

export type TUser = {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
} & TEntityMember

export type TUsers = TUser[]

export type TUserDto = Omit<TUser, '_id' | '__v'>
export type TUserCrypt = Omit<TUser, 'password'>
export type TUserLogin = Pick<TUser, 'email' | 'password'>

const userSchema = new Schema<TUserDto>({
  firstName: { type: String, required: true, maxLength: 20 },
  lastName: { type: String, required: true, maxLength: 40 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
})

export const UserModel = model<TUserDto>('User', userSchema)

// helpers
export const isUserDto: TypeGuard<TUserDto> = (value): value is TUserDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'firstName' in value &&
    typeof (value as TEntityRecord).firstName === 'string' &&
    'lastName' in value &&
    typeof (value as TEntityRecord).lastName === 'string' &&
    'email' in value &&
    typeof (value as TEntityRecord).email === 'string' &&
    'password' in value &&
    typeof (value as TEntityRecord).password === 'string' &&
    (!('role' in value) ||
      ('role' in value && typeof (value as TEntityRecord).role === 'string'))
  )
}

export const isUserLogin: TypeGuard<TUserLogin> = (
  value,
): value is TUserLogin => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'email' in value &&
    typeof (value as TEntityRecord).email === 'string' &&
    'password' in value &&
    typeof (value as TEntityRecord).password === 'string'
  )
}
