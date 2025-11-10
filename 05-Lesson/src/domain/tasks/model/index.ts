import { Schema, model } from 'mongoose';
import type { TEntityMember } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-member';
import type TypeGuard from '../../../app-infrastructure/app-type-helpers/type-guard';
import type { TEntityRecord } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-data';

export type TTask = {
  description: string;
  completed?: boolean;
  createBy: Schema.Types.ObjectId;
} & TEntityMember;

export type TTasks = TTask[];

export type TTaskDto = Omit<TTask, '_id' | '__v'>;

const taskSchema = new Schema<TTaskDto>({
  description: { type: String, required: true, unique: true },
  completed: { type: Boolean, default: false },
  createBy: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
});

export const TaskModel = model<TTaskDto>('Task', taskSchema);

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
