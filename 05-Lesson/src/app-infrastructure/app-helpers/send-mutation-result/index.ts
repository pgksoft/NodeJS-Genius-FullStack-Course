import type { Response } from 'express';
import type TEntityMutationResult from '../../api/types/t-entity-mutation-result';

const sendMutationResult = <T>(result: TEntityMutationResult<T>, res: Response) => {
  if (result.isSuccess) {
    return res.status(result.code).json(result.data);
  }
  return res.status(result.code).json({ message: result.errorMessage });
};

export default sendMutationResult;
