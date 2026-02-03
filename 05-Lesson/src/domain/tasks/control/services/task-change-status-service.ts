import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  taskPopulateConfig,
  taskSerializationRules,
} from '@domain/tasks/const/serialization&populate-config';
import { TaskStatusModel } from '@domain/tasks/inner-entities/task-status-dic/model';
import { TaskStatusLogModel } from '@domain/tasks/inner-entities/task-status-log/model';
import {
  TaskModel,
  type TApiTask,
  type TTaskPopulated,
  type TTaskSchema,
} from '@domain/tasks/model';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '@helpers/send-mutation-result/crud-result';
import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';

export type TInputParams = { taskId: string; statusId: string; userId: string; comment?: string };

export const taskChangeStatusService = async (
  params: TInputParams,
): Promise<TEntityMutationResult<TApiTask>> => {
  const { taskId, statusId, comment, userId } = params;

  const task = await TaskModel.findById(taskId);
  if (!task) return getCrudResultError(404, `Task-Change-Status: task ${taskId} not found`);

  const newStatus = await TaskStatusModel.findById(statusId);
  if (!newStatus)
    return getCrudResultError(404, `Task-Change-Status: task status ${statusId} not found`);

  const log = await TaskStatusLogModel.create({
    taskId,
    taskStatusId: statusId,
    comment,
    startDate: new Date(),
    createBy: userId,
  });

  task.taskStatusEventId = log._id;
  await task.save();

  const apiTask = await findByIdPopulateAndSerialize<
    TTaskPopulated,
    typeof taskSerializationRules,
    TApiTask,
    TTaskSchema
  >(TaskModel, taskId, taskSerializationRules, taskPopulateConfig);
  if (!apiTask) return getCrudResultError(464);
  return getCrudResultSuccess(apiTask);
};
