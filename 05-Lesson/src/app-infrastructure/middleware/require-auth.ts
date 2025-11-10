import type { Request, Response, NextFunction } from 'express';
import sendMutationResult from '../app-helpers/send-mutation-result';
import { getCrudResultError } from '../app-helpers/send-mutation-result/crud-result';
import APP_TITLE from '../const/app-title';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendMutationResult(getCrudResultError(401, APP_TITLE.authError), res);
  }
  next();
};
