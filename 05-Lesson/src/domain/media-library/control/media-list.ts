import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';
import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TMedia, TMediaLibrary } from '../model';
import { MediaModel } from '../model';
import { populateEntity } from '@db/populate-entity';
import type { TUser } from '@domain/users/model';

export async function mediaList(
  filter: TUnknownRecord,
): Promise<TEntityMutationResult<TMediaLibrary>> {
  try {
    const mediaLibrary = await populateEntity<TMedia, 'createBy', TUser, keyof TUser>(
      MediaModel.find(filter),
      'createBy',
      { mode: 'exclude', keys: ['password'] },
    ).lean<TMediaLibrary>();
    return getCrudResultSuccess(mediaLibrary);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
