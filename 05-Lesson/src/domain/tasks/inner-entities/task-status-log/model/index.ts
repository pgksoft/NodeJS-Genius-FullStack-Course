import { model, Schema, type Types } from 'mongoose';
import type { TApiTaskStatus, TTaskStatusPopulated } from '../../task-status-dic/model';
import type { TApiUser, TUser } from '@domain/users/model';
import type { TFieldsSchema } from '@infra/app-type-helpers/t-fields-schema';
import type TypeGuard from '@infra/app-type-helpers/type-guard';
import type { TEntityRecord } from '@infra/app-entities/app-entity-types/t-entity-data';
import { collectionNames } from '@db/const/collection-names';
import type { TEntityMember } from '@infra/app-entities/app-entity-types/t-entity-member';
import type { TApiTask, TTaskPopulated } from '@domain/tasks/model';
import { applyIntervalValidators } from '@infra/validators/interval-validator';

export type TTaskStatusEvent = {
  taskId: Types.ObjectId;
  taskStatusId: Types.ObjectId;
  comment: string;
  startDate: Date;
  endDate: Date;
  createBy: Types.ObjectId;
} & TEntityMember;

// for selected task
export type TTaskStatusEventPopulated = Omit<TTaskStatusEvent, 'taskStatusId' | 'createBy'> & {
  taskStatusId: TTaskStatusPopulated;
  createBy: TUser;
};

export type TApiTaskStatusEvent = Omit<TTaskStatusEvent, 'taskStatusId' | 'createBy'> & {
  taskStatusId: TApiTaskStatus;
  createBy: TApiUser;
};

export type TApiTaskStatusEventLog = TApiTaskStatusEvent[];

// for log
export type TTaskStatusLogPopulated = Omit<
  TTaskStatusEvent,
  'taskId' | 'taskStatusId' | 'createBy'
> & {
  taskId: TTaskPopulated;
  taskStatusId: TTaskStatusPopulated;
  createBy: TUser;
};

export type TApiTaskStatusLog = Omit<TTaskStatusEvent, 'taskId' | 'taskStatusId' | 'createBy'> & {
  taskId: TApiTask;
  taskStatusId: TApiTaskStatus;
  createBy: TApiUser;
};

export type TApiTaskStatusLogList = TApiTaskStatusLog[];

// DTO for creating a new element in the task-status-log entity
export type TTaskStatusEventDto = Pick<TTaskStatusEventSchema, 'taskId' | 'taskStatusId'>;
// DTO for implementation change-status task command
export type TTaskChangeStatusDto = Pick<TTaskStatusEventSchema, 'taskStatusId' | 'comment'>;

// Definition Schema & Model
export type TTaskStatusEventSchema = Omit<TTaskStatusEvent, '_id' | '__v'>;

export const taskStatusEventFieldsSchema: TFieldsSchema<TTaskStatusEventSchema> = {
  taskId: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.task,
    required: true,
    index: true,
    openApi: { description: 'ID of the task this status event belongs to' },
  },
  taskStatusId: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.taskStatusDic,
    required: true,
    openApi: { description: 'ID of the task status applied during this event' },
  },
  comment: {
    type: String,
    default: '',
    maxLength: 240,
    openApi: { description: 'additional information about the event' },
  },
  startDate: {
    type: Date,
    required: true,
    openApi: {
      type: 'string',
      format: 'date-time',
      description: 'Date and time when this status became active (ISO 8601, UTC)',
    },
  },
  endDate: {
    type: Date,
    default: null,
    openApi: {
      type: 'string',
      format: 'date-time',
      nullable: true,
      description: 'Date and time when this status stopped being active. Null if still active.',
    },
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.user,
    required: true,
    index: true,
    openApi: { description: 'ID of the user who recorded this status event. Autocomplete.' },
  },
};

const taskStatusEventSchema = new Schema<TTaskStatusEventSchema>(taskStatusEventFieldsSchema);
taskStatusEventSchema.index({ taskID: 1, taskStatusId: 1, startDate: 1 }, { unique: true });
applyIntervalValidators(
  taskStatusEventSchema,
  {
    start: 'startDate',
    end: 'endDate',
    scope: 'taskId',
  },
  {
    enforceContinuity: true,
    enforceNoOverlap: false,
  },
);

export const TaskStatusLogModel = model<TTaskStatusEventSchema>(
  collectionNames.taskStatusLog,
  taskStatusEventSchema,
  collectionNames.taskStatusLog,
);

// helpers
export const isTaskStatusEventDto: TypeGuard<TTaskStatusEventDto> = (
  value,
): value is TTaskStatusEventDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'taskId' in value &&
    typeof (value as TEntityRecord).taskId === 'string' &&
    'taskStatusId' in value &&
    typeof (value as TEntityRecord).taskStatusId === 'string'
  );
};

export const isTaskChangeStatusDto: TypeGuard<TTaskChangeStatusDto> = (
  value,
): value is TTaskChangeStatusDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'taskStatusId' in value &&
    typeof (value as TEntityRecord).taskStatusId === 'string' &&
    'comment' in value &&
    typeof (value as TEntityRecord).comment === 'string'
  );
};
