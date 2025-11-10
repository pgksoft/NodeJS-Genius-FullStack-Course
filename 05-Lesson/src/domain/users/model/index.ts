import { Schema, model } from 'mongoose';
import type { TEntityMember } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-member';
import type TypeGuard from '../../../app-infrastructure/app-type-helpers/type-guard';
import type { TEntityRecord } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-data';
import { isRoleType } from '@access/role-type';

export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
} & TEntityMember;

export type TUsers = TUser[];

export type TUserDto = Omit<TUser, '_id' | '__v'>;
export type TUserCrypt = Omit<TUser, 'password'>;
export type TUserLogin = Pick<TUser, 'email' | 'password'>;

const userSchema = new Schema<TUserDto>({
  firstName: { type: String, required: true, maxLength: 20 },
  lastName: { type: String, required: true, maxLength: 40 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

export const UserModel = model<TUserDto>('User', userSchema);

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
      ('role' in value &&
        typeof (value as TEntityRecord).role === 'string' &&
        isRoleType((value as TEntityRecord).role)))
  );
};

export const isUserLogin: TypeGuard<TUserLogin> = (value): value is TUserLogin => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'email' in value &&
    typeof (value as TEntityRecord).email === 'string' &&
    'password' in value &&
    typeof (value as TEntityRecord).password === 'string'
  );
};
