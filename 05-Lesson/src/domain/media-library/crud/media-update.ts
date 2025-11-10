import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import type { TMedia, TMediaDto } from '../model';
import { MediaModel } from '../model';

export async function mediaUpdate(
  id: string,
  mediaDto: TMediaDto,
): Promise<TEntityMutationResult<TMedia>> {
  try {
    const media = await MediaModel.findByIdAndUpdate(id, mediaDto, {
      new: true,
      runValidators: true,
    }).lean();
    if (!media) {
      return getCrudResultError(404);
    }
    return getCrudResultSuccess(media);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
