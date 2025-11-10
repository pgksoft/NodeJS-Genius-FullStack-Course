const createEnumGuard =
  <E extends object>(enumObj: E) =>
  (value: unknown): value is keyof E =>
    typeof value === 'string' && value in enumObj;

export default createEnumGuard;
