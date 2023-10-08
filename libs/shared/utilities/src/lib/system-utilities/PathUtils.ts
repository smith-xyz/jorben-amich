import path from 'path';
import fs from 'fs';

/**
 *
 * @param filePaths
 * @returns resolved file path, returns null if the resolved path does not exist
 */
function resolveToCwd(...filePaths: string[]): string {
  const resolvedPath = path.join(process.cwd(), ...filePaths);

  const exists = fs.existsSync(resolvedPath);
  if (!exists) return null;

  return resolvedPath;
}

export const PathUtils = {
  resolveToCwd,
};
