import createEnumGuard from '@helpers/create-enum-guard';

enum EntityNameKeys {
  task,
  media,
  user,
}

export type TEntityNameKey = keyof typeof EntityNameKeys;

export const isEntityNameKey = createEnumGuard(EntityNameKeys);
