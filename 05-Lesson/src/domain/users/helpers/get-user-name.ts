import type { TApiUser } from '../model';

const getUserName = (user?: TApiUser): string => {
  if (user) {
    return `${user.firstName} ${user.lastName}`;
  }
  return 'Guest';
};

export default getUserName;
