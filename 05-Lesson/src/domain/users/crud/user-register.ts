import type TEntityMutationResult from '../../../app-infrastructure/app-entities/app-entity-types/t-entity-mutation-result';
import { getCrudResultSuccess } from '../../../app-infrastructure/app-helpers/send-mutation-result/crud-result';
import { hashPlain } from '../../../app-infrastructure/crypt';
import { analyzeMongoError } from '../../../db/analyze-mongo-error';
import type { TUserCrypt, TUserDto } from '../model';
import { UserModel } from '../model';

export async function userRegister(taskDto: TUserDto): Promise<TEntityMutationResult<TUserCrypt>> {
  try {
    const { firstName, lastName, email, role } = taskDto;

    const hash = await hashPlain(taskDto.password);

    const document = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hash,
      role,
    });
    const { password, ...userData } = document.toObject();

    return getCrudResultSuccess(userData, 201);
  } catch (e) {
    return analyzeMongoError(e);
  }
}
