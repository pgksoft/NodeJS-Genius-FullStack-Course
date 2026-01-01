import type { TAccessType } from '../access-type';
import type { TRoleType } from '../role-type';

export type TEntityActionPolicy = Record<TRoleType, TAccessType>;
