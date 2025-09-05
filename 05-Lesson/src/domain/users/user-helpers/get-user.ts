import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { MONGODB_TITLE } from '../../../db/const/mongodb_title'
import { TUserCrypt, UserModel } from '../model'

export async function getUser(
  email: string,
): Promise<TEntityMutationResult<TUserCrypt>> {
  try {
    const document = await UserModel.findOne({ email }).lean()
    if (!document) {
      return getCrudResultError(404, MONGODB_TITLE.userNotFound)
    }
    const { password, ...userData } = document
    return getCrudResultSuccess(userData, 201)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
