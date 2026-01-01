import createEnumGuard from '@helpers/create-enum-guard';

enum RoleTypes {
  admin,
  member,
}

export type TRoleType = keyof typeof RoleTypes;

export const isRoleType = createEnumGuard(RoleTypes);
