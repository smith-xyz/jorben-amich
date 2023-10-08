import fs from 'fs';

type FileOptions = { encoding?: BufferEncoding; flags: string };

function readJSONFile<T = unknown>(
  filePath: string,
  opts: FileOptions = { encoding: 'utf-8', flags: null }
): T {
  const fileBuffer = Buffer.from(fs.readFileSync(filePath, opts));
  return JSON.parse(fileBuffer.toString(opts.encoding));
}

export const FileUtils = {
  readJSONFile,
};
