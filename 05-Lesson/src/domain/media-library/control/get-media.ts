import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TApiMedia, TMediaPopulated, TMediaSchema } from '../model';
import { MediaModel } from '../model';
import {
  mediaPopulateConfig,
  mediaSerializationRules,
} from '../const/serialization&populate-config';

export async function getMedia(id: string): Promise<TEntityMutationResult<TApiMedia>> {
  try {
    const apiMedia = await findByIdPopulateAndSerialize<
      TMediaPopulated,
      typeof mediaSerializationRules,
      TApiMedia,
      TMediaSchema
    >(MediaModel, id, mediaSerializationRules, mediaPopulateConfig);
    if (!apiMedia) {
      return getCrudResultError(404);
    }
    return getCrudResultSuccess(apiMedia);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
