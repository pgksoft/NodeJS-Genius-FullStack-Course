import { populateEntity } from '@db/populate-entity';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TTask } from '../model';
import { TaskModel } from '../model';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type { TUser } from '@domain/users/model';

export async function task(
  id: string,
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TTask>> {
  try {
    const task = await populateEntity<TTask, 'createBy', TUser, keyof TUser>(
      TaskModel.findOne({ _id: id, ...filter }),
      'createBy',
      { mode: 'exclude', keys: ['password'] },
    ).lean();
    if (!task) {
      return getCrudResultError(404);
    }
    return getCrudResultSuccess(task);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
