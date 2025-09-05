import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { comparePlain } from '../../../app-infrastructure/crypt'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { MONGODB_TITLE } from '../../../db/const/mongodb_title'
import { TUserCrypt, TUserLogin, UserModel } from '../model'

export async function userLogin(
  dataLogin: TUserLogin,
): Promise<TEntityMutationResult<TUserCrypt>> {
  const { email, password: candidatePassword } = dataLogin
  try {
    const document = await UserModel.findOne({ email }).lean()
    if (!document) {
      return getCrudResultError(404, MONGODB_TITLE.userNotFound)
    }
    const isValid = await comparePlain(candidatePassword, document.password)
    if (!isValid) {
      return getCrudResultError(400, MONGODB_TITLE.invalidLogin)
    }
    const { password, ...userData } = document
    return getCrudResultSuccess(userData, 201)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
