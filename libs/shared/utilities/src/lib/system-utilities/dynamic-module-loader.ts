import * as fs from 'fs';
import * as path from 'path';

export function dynamicModuleLoader<T = unknown>(modulePath: string): T[] {
  const moduleFiles = fs
    .readdirSync(modulePath)
    .filter((file) => file.endsWith('.js'));

  return moduleFiles.map((file) => {
    const filePath = path.join(modulePath, file);
    return require(filePath);
  });
}
