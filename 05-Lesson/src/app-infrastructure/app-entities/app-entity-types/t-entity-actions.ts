import createEnumGuard from '@helpers/create-enum-guard';

enum EntityActions {
  readOne,
  readList,
  create,
  update,
  delete,
}

export type TEntityAction = keyof typeof EntityActions;

export const isEntityAction = createEnumGuard(EntityActions);
