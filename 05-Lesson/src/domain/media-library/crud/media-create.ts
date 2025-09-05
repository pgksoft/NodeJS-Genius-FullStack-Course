import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { MediaModel, TMedia, TMediaDto } from '../model'

export async function mediaCreate(
  mediaDto: TMediaDto,
): Promise<TEntityMutationResult<TMedia>> {
  try {
    const document = await MediaModel.create(mediaDto)
    const media: TMedia = document.toObject()
    return getCrudResultSuccess(media, 201)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
