import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  taskPopulateConfig,
  taskSerializationRules,
} from '@domain/tasks/const/serialization&populate-config';
import { TaskStatusLogModel } from '@domain/tasks/inner-entities/task-status-log/model';
import {
  TaskModel,
  type TApiTask,
  type TTaskCreateDto,
  type TTaskPopulated,
  type TTaskSchema,
} from '@domain/tasks/model';
import { pickKeys } from '@helpers/pick-keys';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '@helpers/send-mutation-result/crud-result';
import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import type { Types } from 'mongoose';

export const taskCreateService = async (
  taskCreateDto: TTaskCreateDto,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TApiTask>> => {
  const task = await TaskModel.create({
    ...pickKeys(taskCreateDto, ['description']),
    createBy: userID,
  });
  const log = await TaskStatusLogModel.create({
    taskId: task._id,
    taskStatusId: taskCreateDto.taskStatusEventId,
    comment: taskCreateDto.comment,
    startDate: new Date(),
    createBy: userID,
  });
  task.taskStatusEventId = log._id;
  await task.save();

  const apiTask = await findByIdPopulateAndSerialize<
    TTaskPopulated,
    typeof taskSerializationRules,
    TApiTask,
    TTaskSchema
  >(TaskModel, task._id.toString(), taskSerializationRules, taskPopulateConfig);
  if (!apiTask) return getCrudResultError(464);
  return getCrudResultSuccess(apiTask, 201);
};
