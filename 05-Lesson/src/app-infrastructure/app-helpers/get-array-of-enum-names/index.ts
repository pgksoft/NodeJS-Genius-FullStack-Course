const getArrayOfEnumNames = <T extends object>(value: T): (keyof T)[] => {
  return Object.keys(value).filter((key) => isNaN(Number(key))) as (keyof T)[];
};

export default getArrayOfEnumNames;
