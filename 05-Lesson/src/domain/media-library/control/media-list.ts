import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import {
  MediaModel,
  type TApiMedia,
  type TApiMediaLibrary,
  type TMediaPopulated,
  type TMediaSchema,
} from '../model';
import { listPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  mediaPopulateConfig,
  mediaSerializationRules,
} from '../const/serialization&populate-config';

export async function mediaList(
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TApiMediaLibrary>> {
  try {
    const apiMediaLibrary = await listPopulateAndSerialize<
      TMediaPopulated,
      typeof mediaSerializationRules,
      TApiMedia,
      TMediaSchema
    >(MediaModel, filter, mediaSerializationRules, mediaPopulateConfig);
    return getCrudResultSuccess(apiMediaLibrary);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
