import { Schema, model, type Types } from 'mongoose';
import type { TEntityMember } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-member';
import type { TFieldsSchema } from '@infra/app-type-helpers/t-fields-schema';
import type { TApiUser, TUser } from '@domain/users/model';
import { collectionNames } from '@db/const/collection-names';
import type {
  TApiTaskStatusEvent,
  TTaskStatusEventPopulated,
} from '../inner-entities/task-status-log/model';

export type TTask = {
  description: string;
  completed?: boolean;
  taskStatusEventId: Types.ObjectId;
  createBy: Types.ObjectId;
} & TEntityMember;

export type TTaskPopulated = Omit<TTask, 'taskStatusEventId' | 'createBy'> & {
  taskStatusEventId: TTaskStatusEventPopulated;
  createBy: TUser;
};

export type TApiTask = Omit<TTaskPopulated, 'taskStatusEventId' | 'createBy'> & {
  taskStatusEventId: TApiTaskStatusEvent;
  createBy: TApiUser;
};

export type TTasks = TTask[];
export type TApiTasks = TApiTask[];

export type TTaskSchema = Omit<TTask, '_id' | '__v'>;

export type TTaskCreateDto = Omit<TTaskSchema, 'createBy'> & { comment?: string };

export type TTaskUpdateDto = Omit<TTaskSchema, 'createBy' | 'taskStatusId'>;

export const taskFieldsSchema: TFieldsSchema<TTaskSchema> = {
  description: {
    type: String,
    required: true,
    unique: true,
    maxLength: 240,
    openApi: { description: 'Task content' },
  },
  completed: { type: Boolean, default: false, openApi: { description: 'Task status' } },
  taskStatusEventId: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.taskStatusLog,
    openApi: { description: 'Reference to the active task status event.' },
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.user,
    required: true,
    index: true,
    openApi: { description: 'User ID who created or updated task. Autocomplete.' },
  },
};

const taskSchema = new Schema<TTaskSchema>(taskFieldsSchema);

export const TaskModel = model<TTaskSchema>(collectionNames.task, taskSchema);
