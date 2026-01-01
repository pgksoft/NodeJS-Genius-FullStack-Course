import { toDto } from '@helpers/to-dto';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { comparePlain } from '../../../app-infrastructure/crypt';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import { MONGODB_TITLE } from '../../../db/const/mongodb_title';
import type { TUserCrypt, TUserLogin } from '../model';
import { UserModel } from '../model';

export async function userLogin(dataLogin: TUserLogin): Promise<TEntityMutationResult<TUserCrypt>> {
  const { email, password: candidatePassword } = dataLogin;
  try {
    const document = await UserModel.findOne({ email }).lean();
    if (!document) {
      return getCrudResultError(404, MONGODB_TITLE.userNotFound);
    }
    const isValid = await comparePlain(candidatePassword, document.password);
    if (!isValid) {
      return getCrudResultError(400, MONGODB_TITLE.invalidLogin);
    }
    const userData = toDto(document, ['password']);
    return getCrudResultSuccess(userData, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
