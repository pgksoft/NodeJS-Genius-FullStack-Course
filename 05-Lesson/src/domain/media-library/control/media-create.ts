import type { Types } from 'mongoose';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TFileMeta, TMedia, TMediaDto } from '../model';
import { MediaModel } from '../model';
import { populateEntity } from '@db/populate-entity';
import type { TUser } from '@domain/users/model';

export async function mediaCreate(
  mediaDto: TMediaDto,
  fileMeta: TFileMeta,
  userID: Types.ObjectId,
): Promise<TEntityMutationResult<TMedia>> {
  try {
    const document = await MediaModel.create({ ...mediaDto, fileMeta, createBy: userID });
    const media = await populateEntity<TMedia, 'createBy', TUser, keyof TUser>(
      MediaModel.findById(document._id),
      'createBy',
      { mode: 'exclude', keys: ['password'] },
    ).lean();
    return getCrudResultSuccess(media, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
