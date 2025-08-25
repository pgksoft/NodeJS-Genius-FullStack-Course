import { Router } from 'express'
import sendMutationResult from '../../../../app-infrastructure/app-helpers/send-mutation-result'
import { isUserLogin } from '../../model'
import { getCrudResultError } from '../../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { userLogin } from '../../crud/user-login'

const router = Router()

router.get('/', async (req, res) => {
  const dataLogin = req.body
  if (!isUserLogin(dataLogin)) {
    return sendMutationResult(getCrudResultError(400), res)
  }
  const result = await userLogin(dataLogin)
  return sendMutationResult(result, res)
})

export default router
