import { MongoServerError } from 'mongodb'
import { TEntityMutationError } from '../../app-infrastructure/api/types/t-entity-mutation-result'
import { getCrudResultError } from '../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { MONGODB_TITLE } from '../const/mongodb_title'

enum MongoErrorCode {
  DuplicateKey = 11000,
  ValidationFailed = 121,
  Unauthorized = 13,
  AuthFailed = 18,
  NotFound = 47,
}

export function analyzeMongoError(e: unknown): TEntityMutationError {
  if (e instanceof MongoServerError) {
    switch (e.code) {
      case MongoErrorCode.DuplicateKey:
        return getCrudResultError(409, MONGODB_TITLE.duplicateKey)
      case MongoErrorCode.ValidationFailed:
        return getCrudResultError(400, MONGODB_TITLE.validationFailed)
      case MongoErrorCode.Unauthorized:
        return getCrudResultError(401, MONGODB_TITLE.unauthorized)
      case MongoErrorCode.AuthFailed:
        return getCrudResultError(401, MONGODB_TITLE.authFailed)
      case MongoErrorCode.NotFound:
        return getCrudResultError(404, MONGODB_TITLE.notFound)
      default:
        return getCrudResultError(400, e.message)
    }
  }

  if (e instanceof Error) {
    return getCrudResultError(500, e.message || MONGODB_TITLE.unknownError)
  }

  return getCrudResultError(500, MONGODB_TITLE.unknownError)
}
