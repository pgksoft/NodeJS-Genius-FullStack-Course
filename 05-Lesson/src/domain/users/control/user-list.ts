import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import { UserModel, type TUsersCrypt } from '../model';
import { omitKeysArray } from '@helpers/omit-keys-array';

export async function userList(
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TUsersCrypt>> {
  try {
    const users = await UserModel.find(filter).lean();
    return getCrudResultSuccess(omitKeysArray(users, ['password']));
  } catch (e) {
    return analyzeMongoError(e);
  }
}
