import type TEntityMutationResult from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '@helpers/send-mutation-result/crud-result';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import type { TUserCrypt } from '../model';
import { UserModel } from '../model';
import { toDto } from '@helpers/to-dto';

export async function getUser(email: string): Promise<TEntityMutationResult<TUserCrypt>> {
  try {
    const document = await UserModel.findOne({ email }).lean();
    if (!document) {
      return getCrudResultError(404, MONGODB_TITLE.userNotFound);
    }
    const userData = toDto(document, ['password']);
    return getCrudResultSuccess(userData, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
