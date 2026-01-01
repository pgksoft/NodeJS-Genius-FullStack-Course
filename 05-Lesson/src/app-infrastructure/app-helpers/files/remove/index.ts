import type { TMutationResult } from '@infra/app-entities/app-entity-types/t-entity-mutation-result';
import { unlink } from 'fs/promises';

export const removeFile = async (nameFile: string): Promise<TMutationResult> => {
  try {
    await unlink(nameFile);
    return { isSuccess: true };
  } catch (e) {
    return { isSuccess: false, message: (e as Error).message };
  }
};
