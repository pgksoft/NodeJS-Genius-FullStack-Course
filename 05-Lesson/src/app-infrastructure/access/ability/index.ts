import { policies } from '@access/const/policies';
import { isRoleType } from '@access/types/role-type';
import type { TApiUser } from '@domain/users/model';
import type { TAppAction } from '@infra/app-entities/app-entity-types/t-entity-actions';
import type { TEntityNameKey } from '@infra/app-entities/app-entity-types/t-entity-name-key';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

export type TAbilitySuccess = { isAbility: true; filter: TUnknownRecord };

type TAbilityError = { isAbility: false };

type TAbilityAccess = TAbilitySuccess | TAbilityError;

type TGetAbilityAccessInput = {
  entity: TEntityNameKey;
  action: TAppAction;
  user?: TApiUser;
};

export const getAbilityAccess = ({
  entity,
  action,
  user,
}: TGetAbilityAccessInput): TAbilityAccess => {
  if (!user || !isRoleType(user.role)) {
    return { isAbility: false };
  }
  const accessType = policies[entity]?.[action]?.[user.role];
  if (!accessType) {
    return { isAbility: false };
  }
  return { isAbility: true, filter: (accessType === 'own' && { createBy: user._id }) || {} };
};
