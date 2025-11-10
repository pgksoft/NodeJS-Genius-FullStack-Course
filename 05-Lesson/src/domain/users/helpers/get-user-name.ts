import type { TUserCrypt } from '../model';

const getUserName = (user?: TUserCrypt): string => {
  if (user) {
    return `${user.firstName} ${user.lastName}`;
  }
  return 'Guest';
};

export default getUserName;
