import fs from 'fs';
import path from 'path';
import { pipe } from '../function-utilities';

export interface FileParseOptions {
  filePath: string;
  delimiterRules: DelimiterRules;
  outputDir?: string;
}

type DelimiterRules = {
  start: string;
  segment: string;
  // for custom segment handling
  segmentPipe?: Array<SegmentFunction>;
  end: string;
};

type SegmentFunction = (segement: string) => string;

type FileParseOutput = {
  fileName: string;
  delimiterRules: DelimiterRules;
  segments: string[];
  error: string;
};

/**
 * @description function for taking in a directory of files and building SQL from the contents
 * @param {FileParseOptions} options
 * @returns {FileParseOutput} output of sql
 */
export function fileParseBuilder({
  filePath,
  delimiterRules,
  outputDir = undefined,
}: FileParseOptions): FileParseOutput {
  const parseOutput: FileParseOutput = {
    fileName: filePath,
    delimiterRules,
    segments: [],
    error: null,
  };

  try {
    const { start, segment, end, segmentPipe = [] } = delimiterRules;
    let fileContents = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const startIndex = fileContents.indexOf(start);
    if (startIndex < 0) {
      throw new Error('Unable to locate start delimiter');
    }

    fileContents = fileContents.substring(startIndex);

    const endIndex = fileContents.lastIndexOf(end);
    if (endIndex < 0) {
      throw new Error('Unable to locate end delimiter');
    }
    fileContents = fileContents.substring(0, endIndex);

    // now we can navigate and use the segment to build the list
    let segmentIndex = fileContents.indexOf(segment);
    if (segmentIndex < 0) {
      throw new Error('Error parsing with segment');
    }
    while (segmentIndex !== -1) {
      fileContents = fileContents.substring(segmentIndex + segment.length);
      const nextSegmentIndex = fileContents.indexOf(delimiterRules.segment);
      let segmentContent = fileContents.substring(0, nextSegmentIndex);
      segmentContent = pipe(...segmentPipe)(segmentContent);
      parseOutput.segments.push(segmentContent);
      segmentIndex = nextSegmentIndex;
    }
  } catch (err) {
    parseOutput.error = err.message;
  }

  // write to output dir
  if (outputDir && fs.existsSync(outputDir)) {
    const fileName = path.join(outputDir, `file-parse-output-${Date.now()}`);
    fs.writeFileSync(fileName, JSON.stringify(parseOutput), {
      encoding: 'utf-8',
    });
  }

  return parseOutput;
}
