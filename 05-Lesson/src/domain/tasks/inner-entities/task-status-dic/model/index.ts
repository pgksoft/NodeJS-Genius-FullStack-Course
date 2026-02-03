import { Schema, model, type Types } from 'mongoose';
import type { TEntityMember } from '@infra/app-entities/app-entity-types/t-entity-member';
import type { TFieldsSchema } from '@infra/app-type-helpers/t-fields-schema';
import type TypeGuard from '@infra/app-type-helpers/type-guard';
import type { TEntityRecord } from '@infra/app-entities/app-entity-types/t-entity-data';

import type { TApiUser, TUser } from '@domain/users/model';
import { collectionNames } from '@db/const/collection-names';

export type TTaskStatus = {
  name: string;
  code: string;
  mutationDate: Date;
  createBy: Types.ObjectId;
} & TEntityMember;

export type TTaskStatusPopulated = Omit<TTaskStatus, 'createBy'> & { createBy: TUser };

export type TApiTaskStatus = Omit<TTaskStatusPopulated, 'createBy' | 'mutationDate'> & {
  mutationDate: string;
  createBy: TApiUser;
};

export type TTaskStatusDic = TTaskStatus[];
export type TApiTaskStatusDic = TApiTaskStatus[];

export type TTaskStatusSchema = Omit<TTaskStatus, '_id' | '__v'>;

export type TTaskStatusMutationDto = Omit<TTaskStatusSchema, 'createBy' | 'mutationDate'>;

export const taskStatusFieldsSchema: TFieldsSchema<TTaskStatusSchema> = {
  name: {
    type: String,
    required: true,
    unique: true,
    maxLength: 240,
    openApi: { description: 'Task status name' },
  },
  code: {
    type: String,
    required: true,
    unique: true,
    maxLength: 20,
    openApi: { description: 'Task status code' },
  },
  mutationDate: {
    type: Date,
    required: true,
    openApi: {
      type: 'string',
      format: 'date-time',
      description: 'Status mutation datetime in ISO 8601 format (UTC)',
    },
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.user,
    required: true,
    index: true,
    openApi: { description: 'User ID who created or updated task status. Autocomplete.' },
  },
};

const taskStatusSchema = new Schema<TTaskStatusSchema>(taskStatusFieldsSchema);

export const TaskStatusModel = model<TTaskStatusSchema>(
  collectionNames.taskStatusDic,
  taskStatusSchema,
  collectionNames.taskStatusDic,
);

// helpers
export const isTaskStatusDto: TypeGuard<TTaskStatusMutationDto> = (
  value,
): value is TTaskStatusMutationDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'name' in value &&
    typeof (value as TEntityRecord).name === 'string' &&
    'code' in value &&
    typeof (value as TEntityRecord).code === 'string'
  );
};
