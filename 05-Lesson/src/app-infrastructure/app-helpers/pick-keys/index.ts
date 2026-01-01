// Select only the specified keys
export const pickKeys = <S, U extends keyof S>(obj: S, keys?: U[]): Pick<S, U> => {
  if (!keys) return {} as Pick<S, U>;
  return keys.reduce(
    (acc, k) => {
      acc[k] = obj[k];
      return acc;
    },
    {} as Pick<S, U>,
  );
};
