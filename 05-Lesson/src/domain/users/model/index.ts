import { Schema, model } from 'mongoose';
import type { TEntityMember } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-member';
import type TypeGuard from '../../../app-infrastructure/app-type-helpers/type-guard';
import type { TEntityRecord } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-data';
import type { TRoleType } from '@access/types/role-type';
import { isRoleType } from '@access/types/role-type';
import type { TFieldsSchema } from '@infra/app-type-helpers/t-fields-schema';
import { collectionNames } from '@db/const/collection-names';

export type TUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
} & TEntityMember;

export type TUserPopulated = TUser;

export type TUsers = TUser[];

export type TUserDto = Omit<TUser, '_id' | '__v'>;
export type TApiUser = Omit<TUser, 'password'>;
export type TUserLogin = Pick<TUser, 'email' | 'password'>;

export type TUsersCrypt = TApiUser[];

export const userFieldsSchema: TFieldsSchema<TUserDto> = {
  firstName: {
    type: String,
    required: true,
    maxLength: 20,
    openApi: { description: 'User name' },
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 40,
    openApi: { description: 'User last name' },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    openApi: { format: 'email' },
  },
  password: {
    type: String,
    required: true,
    openApi: { format: 'password' },
  },
  role: {
    type: String,
    default: 'member' satisfies TRoleType,
    enum: ['admin', 'member'] satisfies TRoleType[],
    openApi: { description: 'User role' },
  },
};

const userSchema = new Schema<TUserDto>(userFieldsSchema);

export const UserModel = model<TUserDto>(collectionNames.user, userSchema);

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
