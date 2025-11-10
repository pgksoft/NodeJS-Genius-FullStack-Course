import '@sys/@types/express';
import getUserName from '@domain/users/helpers/get-user-name';
import { logger } from '@logger/index';
import type { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';
import { getLogLevel } from './helpers/get-log-level';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = uuid();
  req.requestId = requestId;

  const { user } = req;

  // Child-logger for the entire request lifecycle
  const reqLogger = logger.child({
    requestId,
    // basic request context
    method: req.method,
    url: req.originalUrl,
    userID: user?._id ?? 'anonymous',
    userName: getUserName(user),
  });

  // Making it available downstream
  res.locals.logger = reqLogger;

  // (Optional) Pass the requestId to the client in the header
  res.setHeader('X-Request-Id', requestId);

  // We log the fact of an incoming request
  const start = Date.now();
  reqLogger.debug('Incoming request');
  // Finally, here's the summary log
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = getLogLevel(res.statusCode);
    reqLogger[level]({ status: res.statusCode, duration }, 'HTTP request completed');
  });

  next();
}
