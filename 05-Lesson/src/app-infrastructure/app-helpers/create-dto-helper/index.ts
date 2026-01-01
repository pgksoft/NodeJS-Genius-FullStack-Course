//
export function createDtoHelper<K extends string>(omitKeys: K[]) {
  const omit = <T extends Record<K, unknown>>(entity: T, extraKeys: K[] = []): Omit<T, K> => {
    const clone = { ...entity };
    for (const key of [...omitKeys, ...extraKeys]) {
      delete clone[key];
    }
    return clone;
  };

  return {
    // standard serialize
    serialize<T extends Record<K, unknown>>(
      input: T | T[],
      extraKeys: K[] = [],
    ): Omit<T, K> | Omit<T, K>[] {
      return Array.isArray(input)
        ? input.map((entity) => omit(entity, extraKeys))
        : omit(input, extraKeys);
    },

    // convenient method for temporary expansion
    withExtraOmit(extraKeys: K[]) {
      return {
        serialize<T extends Record<K, unknown>>(input: T | T[]): Omit<T, K> | Omit<T, K>[] {
          return Array.isArray(input)
            ? input.map((entity) => omit(entity, extraKeys))
            : omit(input, extraKeys);
        },
      };
    },
  };
}
