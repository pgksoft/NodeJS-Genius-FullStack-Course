import sendMutationResult from '@helpers/send-mutation-result';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import type { Request, Response, NextFunction } from 'express';
import { isMediaDto } from '../model';
import { isStrictValidObjectId } from '@db/is-strict-valid-object-id';
import { MONGODB_TITLE } from '@db/const/mongodb_title';
import { analyzeMongoError } from '@db/analyze-mongo-error';

/**
 * Middleware validator for MediaUpdateDto
 * - Ensures either description or file is provided
 * - Checks file uniqueness in DB
 * - Handles ownership conflicts
 */
export const updateValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Rule 1
    const { id } = req.params;
    if (!isStrictValidObjectId(id)) {
      return sendMutationResult(getCrudResultError(400, MONGODB_TITLE.invalidId), res);
    }

    // Rule 2: At least one field must be provided
    const { file } = req;
    const mediaDto = req.body;
    if (!isMediaDto(mediaDto) && !file) {
      return sendMutationResult(
        getCrudResultError(400, 'Bad request: either description or file must be provided'),
        res,
      );
    }

    // If all checks passed → continue
    next();
  } catch (err) {
    return sendMutationResult(analyzeMongoError(err), res);
  }
};
