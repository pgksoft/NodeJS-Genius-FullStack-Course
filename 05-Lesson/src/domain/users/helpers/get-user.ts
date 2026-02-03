import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '@helpers/send-mutation-result/crud-result';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import type { TApiUser } from '../model';
import { UserModel } from '../model';
import { omitKeys } from '@helpers/omit-keys';

export async function getUser(email: string): Promise<TEntityMutationResult<TApiUser>> {
  try {
    const document = await UserModel.findOne({ email }).lean();
    if (!document) {
      return getCrudResultError(404, MONGODB_TITLE.userNotFound);
    }
    const userData = omitKeys(document, ['password']);
    return getCrudResultSuccess(userData, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
