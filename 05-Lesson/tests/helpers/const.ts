import { TUserDto } from '@domain/users/model';

export const TEST_VAR = {
  userAdmin: {
    firstName: 'Admin',
    lastName: 'PgkSoft',
    email: 'admin@example.com',
    role: 'admin',
    password: '987654321',
  } satisfies TUserDto,
};
