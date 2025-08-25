import { Router } from 'express'
import { isUserDto } from '../../model'
import sendMutationResult from '../../../../app-infrastructure/app-helpers/send-mutation-result'
import { getCrudResultError } from '../../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { userRegister } from '../../crud/user-register'

const router = Router()

router.post('/', async (req, res) => {
  const userDto = req.body
  const isMutationUser = isUserDto(userDto)
  if (!isMutationUser) {
    return sendMutationResult(getCrudResultError(400), res)
  }
  const result = await userRegister(userDto)
  return sendMutationResult(result, res)
})

export default router
