import type { Logger } from 'pino';
import type { TUserCrypt } from '../../../../domain/users/model';
import type { TAbilitySuccess } from '@access/ability';

declare global {
  namespace Express {
    interface Request {
      user?: TUserCrypt;
      requestId?: string;
      abilityAccess: TAbilitySuccess;
    }
    interface Locals {
      logger?: Logger;
    }
  }
}

export {};
