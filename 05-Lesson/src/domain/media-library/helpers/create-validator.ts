import type { Request, Response, NextFunction } from 'express';
import { isMediaDto } from '../model';
import sendMutationResult from '@helpers/send-mutation-result';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';

export const createValidator = async (req: Request, res: Response, next: NextFunction) => {
  const mediaDto = req.body;
  const isMutationTask = isMediaDto(mediaDto);
  if (!isMutationTask) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  if (!req.file) {
    return sendMutationResult(getCrudResultError(400), res);
  }
  return next();
};
