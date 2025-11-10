import { policies } from '@access/policies';
import { isRoleType } from '@access/role-type';
import type { TUserCrypt } from '@domain/users/model';
import type { TEntityAction } from '@infra/app-entities/app-entity-types/t-entity-actions';
import type { TEntityNameKey } from '@infra/app-entities/app-entity-types/t-entity-name-key';
import type TUnknownRecord from '@infra/app-type-helpers/t-unknown-record';

export type TAbilitySuccess = { isAbility: true; filter: TUnknownRecord };

type TAbilityError = { isAbility: false };

type TAbilityAccess = TAbilitySuccess | TAbilityError;

type TGetAbilityAccessInput = {
  entity: TEntityNameKey;
  action: TEntityAction;
  user?: TUserCrypt;
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
