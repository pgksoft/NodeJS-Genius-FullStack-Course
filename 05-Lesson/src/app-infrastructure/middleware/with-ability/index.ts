import type { Request, Response, NextFunction } from 'express';
import '@sys/@types/express';
import { getAbilityAccess } from '@access/ability';
import { getCrudResultError } from '@helpers/send-mutation-result/crud-result';
import sendMutationResult from '@helpers/send-mutation-result';
import APP_TITLE from '@infra/const/app-title';
import type { TEntityNameKey } from '@infra/app-entities/app-entity-types/t-entity-name-key';
import type { TAppAction } from '@infra/app-entities/app-entity-types/t-entity-actions';

export function withAbility(entity: TEntityNameKey, action: TAppAction) {
  return (req: Request, res: Response, next: NextFunction) => {
    const abilityAccess = getAbilityAccess({ entity, action, user: req.user });
    if (!abilityAccess.isAbility) {
      return sendMutationResult(getCrudResultError(401, APP_TITLE.authError), res);
    }
    req.abilityAccess = abilityAccess;
    next();
  };
}
