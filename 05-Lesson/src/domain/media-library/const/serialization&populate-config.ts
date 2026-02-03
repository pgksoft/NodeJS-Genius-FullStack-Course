import type { RulesFor } from '@serialization/dsl-types';
import { userSerializationRules } from '@domain/users/const/serialization';
import type { TMediaPopulated } from '../model';
import { buildPopulateConfigFromRules } from '@db/populate-&-serialize/helpers/build-populate-config-from-rules';

export const mediaSerializationRules: RulesFor<TMediaPopulated> = {
  createBy: {
    kind: 'entityOf',
    rules: userSerializationRules,
  },
  _id: { kind: 'objectId' },
  __v: { kind: 'exclude' },
} as const;

export const mediaPopulateConfig = buildPopulateConfigFromRules(mediaSerializationRules);
