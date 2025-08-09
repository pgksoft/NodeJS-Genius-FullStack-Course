import TypeGuard from '../../app-helpers/type-guard/type-guard'
import IEntityMember from '../types/i-entity-member'
import { TEntityRecord } from '../types/t-entity-data'

const isEntityMember: TypeGuard<IEntityMember> = (
  value,
): value is IEntityMember => {
  return (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof (value as TEntityRecord).id === 'string'
  )
}

export default isEntityMember
