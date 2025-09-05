import { Router } from 'express'
import {
  MULTER_REQUEST_KEY,
  uploadSingle,
  uploadMultiple,
} from '../../../app-infrastructure/multer'
import sendMutationResult from '../../../app-infrastructure/app-helpers/send-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'

const router = Router()

router.post('/', async (req, res) => {
  try {
    await uploadSingle(req, res, (err) => {
      if (err) {
        return sendMutationResult(
          getCrudResultError(400, (err as Error).message),
          res,
        )
      }
      return sendMutationResult(getCrudResultSuccess(req.file), res)
    })
  } catch (e) {
    return analyzeMongoError(e)
  }
})

router.post(
  '/multiple',
  uploadMultiple.array(MULTER_REQUEST_KEY, 4),
  (req, res) => {
    try {
      return sendMutationResult(getCrudResultSuccess(req.files), res)
    } catch (e) {
      return analyzeMongoError(e)
    }
  },
)

export default router
