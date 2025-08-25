import bcrypt from 'bcryptjs';

export const hashPlain = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

export const comparePlain = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
