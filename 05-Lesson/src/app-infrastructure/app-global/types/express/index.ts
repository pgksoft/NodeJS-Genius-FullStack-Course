import { TUserCrypt } from '../../../../domain/users/model'

declare global {
  namespace Express {
    interface Request {
      user?: TUserCrypt
    }
  }
}

export {}
