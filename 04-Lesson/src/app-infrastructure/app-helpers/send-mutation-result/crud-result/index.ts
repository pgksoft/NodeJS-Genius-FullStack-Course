import {
  TEntityMutationError,
  TEntityMutationSuccess,
} from '../../../api/types/t-entity-mutation-result'
import APP_TITLE from '../../../const/app-title'

export const getCrudResultError = (
  statusCode: number = 400,
  messageError?: string,
): TEntityMutationError => {
  const errorMessage =
    messageError || APP_TITLE[statusCode] || APP_TITLE.unknownError
  return {
    isSuccess: false,
    code: statusCode,
    errorMessage,
  }
}

export const getCrudResultSuccess = <T>(
  statusCode: number = 200,
  data: T,
): TEntityMutationSuccess<T> => {
  return {
    isSuccess: true,
    code: statusCode,
    data,
  }
}
