import type { Request, Response, NextFunction } from 'express';
import { getUser } from '../../domain/users/helpers/get-user';
import { analyzeMongoError } from '@db/analyze-mongo-error';
import { logger } from '@logger/index';

export const extractUser = async (req: Request, res: Response, next: NextFunction) => {
  // check for basic auth header
  const { authorization } = req.headers;

  if (!authorization || authorization.indexOf('Basic') === -1) {
    return next();
  }
  // verify basic auth
  try {
    const base64Credentials = authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email] = credentials.split(':');

    const result = await getUser(email);

    !result.isSuccess && logger.error({ ...result }, 'Extract user');

    // attach user to request object
    result.isSuccess && (req.user = result.data);
  } catch (err) {
    const result = analyzeMongoError(err);
    logger.error({ ...result }, 'Extract user');
  }

  next();
};
