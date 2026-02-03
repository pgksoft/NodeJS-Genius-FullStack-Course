import { getArrayAsStringConst } from '@helpers/get-array-as-string-const';

const mainEntityActions = getArrayAsStringConst(
  'readOne',
  'readList',
  'create',
  'update',
  'delete',
);
const taskActions = getArrayAsStringConst('task-change-status');

export const appActions = [...mainEntityActions, ...taskActions] as const;
export type TAppAction = (typeof appActions)[number];

// runtime guard
const allSetAppAction = new Set<string>(appActions as readonly string[]);
export const isAppAction = (v: unknown): v is TAppAction =>
  typeof v === 'string' && allSetAppAction.has(v);
