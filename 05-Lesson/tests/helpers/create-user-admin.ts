import { userRegister } from '@domain/users/control/user-register';
import { TEST_VAR } from './const';

export const createUserAdmin = async () => {
  const dto = TEST_VAR.userAdmin;

  await userRegister(dto);
};
