import { Schema, model, type Types } from 'mongoose';
import type { TEntityMember } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-member';
import type TypeGuard from '../../../app-infrastructure/app-type-helpers/type-guard';
import type { TEntityRecord } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-data';
import type { TFieldsSchema } from '@infra/app-type-helpers/t-fields-schema';

export type TTask = {
  description: string;
  completed?: boolean;
  createBy: Types.ObjectId;
} & TEntityMember;

export type TTasks = TTask[];

type TTaskSchema = Omit<TTask, '_id' | '__v'>;

export type TTaskDto = Omit<TTaskSchema, 'createBy'>;

export const taskFieldsSchema: TFieldsSchema<TTaskSchema> = {
  description: {
    type: String,
    required: true,
    unique: true,
    maxLength: 240,
    openApi: { description: 'Task content' },
  },
  completed: { type: Boolean, default: false, openApi: { description: 'Task status' } },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
    openApi: { description: 'User ID who created or updated task. Autocomplete.' },
  },
};

const taskSchema = new Schema<TTaskSchema>(taskFieldsSchema);

export const TaskModel = model<TTaskSchema>('Task', taskSchema);

// helpers
export const isTaskDto: TypeGuard<TTaskDto> = (value): value is TTaskDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'description' in value &&
    typeof (value as TEntityRecord).description === 'string' &&
    (!('completed' in value) ||
      ('completed' in value && typeof (value as TEntityRecord).completed === 'boolean'))
  );
};
