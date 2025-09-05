import { Router } from 'express'
import { isMediaDto, TMediaDto } from '../model'
import sendMutationResult from '../../../app-infrastructure/app-helpers/send-mutation-result'
import { getCrudResultError } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { mediaCreate } from '../crud/media-create'
import { uploadSingle } from '../../../app-infrastructure/multer'
import { mediaList } from '../crud/media-list'
import { MONGODB_TITLE } from '../../../db/const/mongodb_title'
import { isStrictValidObjectId } from '../../../db/is-strict-valid-object-id'
import { mediaUpdate } from '../crud/media-update'
import { getMedia } from '../crud/get-media'
import { toDto } from '../../../app-infrastructure/app-helpers/to-dto'

const router = Router()

router.get('/', async (req, res) => {
  const result = await mediaList()
  sendMutationResult(result, res)
})

router.post('/', uploadSingle, async (req, res) => {
  const mediaDto = req.body
  const isMutationTask = isMediaDto(mediaDto)
  if (!isMutationTask) {
    return sendMutationResult(getCrudResultError(400), res)
  }
  if (req.file?.filename) mediaDto.media = req.file?.filename
  const result = await mediaCreate(mediaDto)
  return sendMutationResult(result, res)
})

router.put('/:id', uploadSingle, async (req, res) => {
  const id = req.params.id
  if (!isStrictValidObjectId(id)) {
    return sendMutationResult(
      getCrudResultError(400, MONGODB_TITLE.invalidId),
      res,
    )
  }
  const isMutationTask = isMediaDto(req.body)
  if (!isMutationTask && !req.file?.filename) {
    return sendMutationResult(getCrudResultError(400), res)
  }
  const mediaDto: TMediaDto = { description: '' }
  isMutationTask && Object.assign(mediaDto, req.body)
  if (!isMutationTask) {
    const result = await getMedia(id)
    if (!result.isSuccess) {
      return sendMutationResult(result, res)
    }
    Object.assign(mediaDto, toDto(result.data, ['_id', '__v']))
  }
  if (req.file?.filename) {
    mediaDto.media = req.file?.filename
  }
  const result = await mediaUpdate(id, mediaDto)
  return sendMutationResult(result, res)
})

export default router
