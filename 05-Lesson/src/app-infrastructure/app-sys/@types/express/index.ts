import type { Logger } from 'pino';
import type { TApiUser } from '../../../../domain/users/model';
import type { TAbilitySuccess } from '@access/ability';

declare global {
  namespace Express {
    interface Request {
      user?: TApiUser;
      requestId?: string;
      abilityAccess: TAbilitySuccess;
    }
    interface Locals {
      logger?: Logger;
    }
  }
}

export {};
