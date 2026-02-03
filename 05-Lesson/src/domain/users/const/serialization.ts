import type { RulesFor } from '@serialization/dsl-types';
import type { TUserPopulated } from '../model';

export const userSerializationRules: RulesFor<TUserPopulated> = {
  password: { kind: 'exclude' },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

// export type TApiUser = TSerializeType<TUser, typeof userSerializationRules>;
