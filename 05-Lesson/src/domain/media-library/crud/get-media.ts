import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { MediaModel, TMedia } from '../model'

export async function getMedia(
  id: string,
): Promise<TEntityMutationResult<TMedia>> {
  try {
    const media = await MediaModel.findById(id).lean()
    if (!media) {
      return getCrudResultError(404)
    }
    return getCrudResultSuccess(media)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
