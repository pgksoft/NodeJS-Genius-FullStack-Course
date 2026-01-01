import { toDto } from '@helpers/to-dto';

export function toDtoArray<T extends Record<string, unknown>, K extends keyof T>(
  entities: T[],
  omitKeys: K[],
): Omit<T, K>[] {
  return entities.map((entity) => toDto(entity, omitKeys));
}
