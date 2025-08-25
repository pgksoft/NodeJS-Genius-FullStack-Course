import { Request, Response, NextFunction } from 'express'
import '../app-global/types/express'
import sendMutationResult from '../app-helpers/send-mutation-result'
import { getCrudResultError } from '../app-helpers/send-mutation-result/crud-result'
import APP_TITLE from '../const/app-title'
import { getUser } from '../../domain/users/user-helpers/get-user'

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // check for basic auth header
  const { authorization } = req.headers
  if (!authorization || authorization.indexOf('Basic') === -1) {
    return sendMutationResult(getCrudResultError(401, APP_TITLE.authError), res)
  }
  // verify basic auth
  const base64Credentials = authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
  const [email] = credentials.split(':')

  const result = await getUser(email)

  if (!result.isSuccess) {
    return sendMutationResult(result, res)
  }

  // attach user to request object
  req.user = result.data
  next()
}
