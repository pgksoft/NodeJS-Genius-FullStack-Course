import type { Types } from 'mongoose';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TTask, TTaskDto } from '../model';
import { TaskModel } from '../model';
import { populateEntity } from '@db/populate-entity';
import type { TUser } from '@domain/users/model';

export async function taskCreate(
  taskDto: TTaskDto,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const document = await TaskModel.create({
      ...taskDto,
      createBy: userID,
    });
    const task = await populateEntity<TTask, 'createBy', TUser, keyof TUser>(
      TaskModel.findById(document._id),
      'createBy',
      { mode: 'exclude', keys: ['password'] },
    ).lean();
    return getCrudResultSuccess(task, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
