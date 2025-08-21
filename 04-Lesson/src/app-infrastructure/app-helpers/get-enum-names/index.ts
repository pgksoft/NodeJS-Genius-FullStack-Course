const getEnumNames = (value: object): string[] => {
  return Object.keys(value).filter((key) => {
    return Number.isNaN(Number(key))
  })
}

export default getEnumNames
