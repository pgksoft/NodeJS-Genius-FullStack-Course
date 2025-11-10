import type { Types } from 'mongoose';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TTask, TTaskDto } from '../model';
import { TaskModel } from '../model';

export async function taskCreate(
  taskDto: TTaskDto,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const document = await TaskModel.create({
      description: taskDto.description,
      completed: taskDto.completed,
      createBy: userID,
    });
    const task: TTask = document.toObject();
    return getCrudResultSuccess(task, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
