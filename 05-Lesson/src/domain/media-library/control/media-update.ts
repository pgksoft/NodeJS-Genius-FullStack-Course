import type { Request, Response } from 'express';
import {
  getCrudResultError,
  getCrudResultSuccess,
} from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { MediaModel, type TApiMedia, type TMediaPopulated, type TMediaSchema } from '../model';
import sendMutationResult from '@helpers/send-mutation-result';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { removeFile } from '@helpers/files/remove';
import { findByIdPopulateAndSerialize } from '@db/populate-&-serialize';
import {
  mediaPopulateConfig,
  mediaSerializationRules,
} from '../const/serialization&populate-config';

export const mediaUpdate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const description = req.body?.description;
    const file = req.file;

    const currentMedia = await MediaModel.findById(id);
    if (!currentMedia) {
      return sendMutationResult(getCrudResultError(404, 'Media not found'), res);
    }

    if (description) currentMedia.description = description;
    if (file) {
      // removing previous version of file
      await removeFile(currentMedia.fileMeta!.path);
      // definition new property values
      const { filename, originalname, path, size, mimetype } = file;
      currentMedia.file = filename;
      currentMedia.fileMeta = { mimetype, originalname, path, size };
    }
    currentMedia.createBy = req.user!._id;

    await currentMedia.save();

    const apiMedia = await findByIdPopulateAndSerialize<
      TMediaPopulated,
      typeof mediaSerializationRules,
      TApiMedia,
      TMediaSchema
    >(MediaModel, id, mediaSerializationRules, mediaPopulateConfig);

    return sendMutationResult(getCrudResultSuccess(apiMedia), res);
  } catch (err) {
    return sendMutationResult(analyzeMongoError(err), res);
  }
};
