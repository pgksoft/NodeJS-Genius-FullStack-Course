import { Request, Response, NextFunction } from 'express'
import sendMutationResult from '../app-helpers/send-mutation-result'
import { getCrudResultError } from '../app-helpers/send-mutation-result/crud-result'
import { MONGODB_TITLE } from '../../db/const/mongodb_title'
import { analyzeMongoError } from '../../db/analyze-mongo-error'

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req
    if (!user) {
      return sendMutationResult(
        getCrudResultError(404, MONGODB_TITLE.userNotFound),
        res,
      )
    }

    if (user.role !== 'admin') {
      return sendMutationResult(
        getCrudResultError(500, MONGODB_TITLE.userInvalidPermissions),
        res,
      )
    }

    next()
  } catch (e) {
    return analyzeMongoError(e)
  }
}
