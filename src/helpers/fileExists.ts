import { promises } from 'fs';

export async function fileExists(path: string) {
  try {
    await promises.stat(path);
    return true;
  } catch (err) {
    return false;
  }
}
