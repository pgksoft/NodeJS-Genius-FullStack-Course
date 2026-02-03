import { Schema, model, type Types } from 'mongoose';
import type { TEntityMember } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-member';
import type TypeGuard from '../../../app-infrastructure/app-type-helpers/type-guard';
import type { TEntityRecord } from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-data';
import type { TFieldsSchema } from '@infra/app-type-helpers/t-fields-schema';
import type { MULTER_REQUEST_KEY } from '@infra/multer';
import type { TApiUser, TUser } from '@domain/users/model';
import { collectionNames } from '@db/const/collection-names';

export type TFileMeta = Pick<Express.Multer.File, 'originalname' | 'mimetype' | 'path' | 'size'>;

export type TMedia = {
  description: String;
  [MULTER_REQUEST_KEY]?: String | null;
  fileMeta?: TFileMeta;
  createBy: Types.ObjectId;
} & TEntityMember;

export type TMediaLibrary = TMedia[];

export type TMediaPopulated = Omit<TMedia, 'createBy'> & { createBy: TUser };
export type TApiMedia = Omit<TMedia, 'createBy'> & { createBy: TApiUser };

export type TApiMediaLibrary = TApiMedia[];

export type TMediaSchema = Omit<TMedia, '_id' | '__v'>;

export type TMediaDto = Omit<TMediaSchema, 'createBy' | 'fileMeta'>;

export const mediaFieldsSchema: TFieldsSchema<TMediaSchema> = {
  description: {
    type: String,
    required: true,
    maxLength: 240,
    openApi: { description: 'Brief description of the media file (media file content)' },
  },
  file: { type: String, required: true, unique: true, openApi: { description: 'File name' } },
  fileMeta: {
    type: {
      originalname: { type: String, required: true },
      mimetype: { type: String, required: true },
      path: { type: String, required: true },
      size: { type: Number, required: true },
    },
    required: false,
    openApi: { description: 'Metadata of uploaded file' },
  },
  createBy: {
    type: Schema.Types.ObjectId,
    ref: collectionNames.user,
    required: true,
    index: true,
    openApi: { description: 'User ID who created or change media file. Autocomplete.' },
  },
};

const mediaSchema = new Schema<TMediaSchema>(mediaFieldsSchema);

export const MediaModel = model<TMediaSchema>(collectionNames.mediaLibrary, mediaSchema);

// helpers
export const isMediaDto: TypeGuard<TMediaDto> = (value): value is TMediaDto => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'description' in value &&
    typeof (value as TEntityRecord).description === 'string' &&
    (!('file' in value) || ('file' in value && typeof (value as TEntityRecord).file === 'string'))
  );
};
