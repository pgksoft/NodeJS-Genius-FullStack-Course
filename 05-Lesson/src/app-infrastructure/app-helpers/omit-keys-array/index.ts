import { omitKeys } from '@helpers/omit-keys';

export function omitKeysArray<T, K extends keyof T>(entities: T[], keys: K[]): Omit<T, K>[] {
  return entities.map((entity) => omitKeys(entity, keys));
}
