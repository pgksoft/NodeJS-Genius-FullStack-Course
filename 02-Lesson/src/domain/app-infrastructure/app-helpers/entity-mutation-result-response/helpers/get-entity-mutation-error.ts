import { TEntityMutationError } from '../../../api/types/t-entity-mutation-result'
import APP_TITLE from '../../../const/app-title'

const getEntityMutationError = (statusCode: number): TEntityMutationError => {
  return {
    isSuccess: false,
    code: statusCode,
    errorMessage: APP_TITLE[statusCode],
  }
}

export default getEntityMutationError
