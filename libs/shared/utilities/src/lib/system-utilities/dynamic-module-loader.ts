import * as fs from 'fs';
import * as path from 'path';

export function dynamicModulesLoader<T = unknown>(modulePath: string): T[] {
  const moduleFiles = fs
    .readdirSync(modulePath)
    .filter((file) => file.endsWith('.js'));

  return moduleFiles.map((file) => {
    const filePath = path.join(modulePath, file);
    return require(filePath);
  });
}

export function dynamicModuleLoader<T = unknown>(moduleFilePath: string): T {
  if (!moduleFilePath.endsWith('.js')) throw new Error('Must be a .js file');

  return require(moduleFilePath);
}
