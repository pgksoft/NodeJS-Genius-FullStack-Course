import type { Types } from 'mongoose';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TApiMedia, TFileMeta, TMediaDto, TMediaPopulated, TMediaSchema } from '../model';
import { MediaModel } from '../model';
import { createPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  mediaPopulateConfig,
  mediaSerializationRules,
} from '../const/serialization&populate-config';
import { removeFile } from '@helpers/files/remove';

export async function mediaCreate(
  mediaDto: TMediaDto,
  fileMeta: TFileMeta,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TApiMedia>> {
  try {
    const apiMedia = await createPopulateAndSerialize<
      TMediaPopulated,
      typeof mediaSerializationRules,
      TApiMedia, // API DTO
      TMediaSchema // schema type
    >(
      MediaModel,
      {
        ...mediaDto,
        fileMeta,
        createBy: userID,
      },
      mediaSerializationRules,
      mediaPopulateConfig,
    );
    if (!apiMedia) return getCrudResultError(464);
    return getCrudResultSuccess(apiMedia, 201);
  } catch (e) {
    // removing uploaded file
    await removeFile(fileMeta.path);
    return analyzeMongoError(e);
  }
}
