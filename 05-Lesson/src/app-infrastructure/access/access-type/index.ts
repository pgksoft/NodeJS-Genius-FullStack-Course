enum AccessTypes {
  any,
  own,
}

export type TAccessType = keyof typeof AccessTypes;
