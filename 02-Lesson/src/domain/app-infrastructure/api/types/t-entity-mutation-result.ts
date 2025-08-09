type TEntityMutationSuccess<T> = {
  isSuccess: true
  code: number
  data: T
}

export type TEntityMutationError = {
  isSuccess: false
  code: number
  errorMessage: string
}

type TEntityMutationResult<T> = TEntityMutationSuccess<T> | TEntityMutationError

export default TEntityMutationResult
