import TEntityMutationResult from '../../../app-infrastructure/api/types/t-entity-mutation-result'
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result'
import { analyzeMongoError } from '../../../db/analyze-mongo-error'
import { MediaModel, TMediaLibrary } from '../model'

export async function mediaList(): Promise<TEntityMutationResult<TMediaLibrary>> {
  try {
    const mediaLibrary = await MediaModel.find().lean()
    return getCrudResultSuccess(mediaLibrary)
  } catch (e) {
    return analyzeMongoError(e)
  }
}
