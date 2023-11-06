import { fileParseBuilder } from './file-parse-builder';
import * as fs from 'fs';
import * as path from 'path';

const testDir = path.join(__dirname, '/test_temp_fp');
const testFile1 = `
-----

FIRST ARTICLE [I, Q. 1, Art. 1]

Whether, besides Philosophy, any Further Doctrine Is Required?

Objection 1: It seems that, besides philosophical science, we have no
need of any further knowledge. For man should not seek to know what is
above reason: "Seek not the things that are too high for thee"
(Ecclus. 3:22). But whatever is not above reason is fully treated of
in philosophical science. Therefore any other knowledge besides
philosophical science is superfluous.

------
`;

function createFiles() {
  fs.mkdirSync(testDir);
  const i = 1;
  for (const file of [testFile1]) {
    fs.writeFileSync(path.join(testDir, `test-file-${i}`), file);
  }
}

function reset() {
  if (fs.existsSync(testDir)) {
    const files = fs.readdirSync(testDir);
    for (const file of files) {
      fs.rmSync(path.join(testDir, file));
    }
    fs.rmdirSync(testDir);
  }
}

describe('fileParseBuilder', () => {
  beforeAll(reset);
  beforeAll(createFiles);
  afterAll(reset);
  it('will parse the file based on the delimiters provided and write to a file', () => {
    const result = fileParseBuilder({
      filePath: path.join(testDir, `test-file-1`),
      delimiterRules: { start: '-----', segment: '\n\n', end: '-----' },
      outputDir: testDir,
    });
    expect(result.error).toBeNull();
    expect(result.segments).toHaveLength(4);
    expect(fs.readdirSync(testDir)).toHaveLength(2);
  });

  it('will list error when providing delimiter rules that it cannot follow', () => {
    const result = fileParseBuilder({
      filePath: path.join(testDir, `test-file-1`),
      delimiterRules: {
        start: '-----',
        segment: 'skjdflksdjfslfj',
        end: '-----',
      },
      outputDir: testDir,
    });
    expect(result.error).toEqual('Error parsing with segment');
  });

  it('will list allow using pipe function for additional parsing', () => {
    const segmentFn1 = (segment: string): string => {
      return segment.startsWith('FIRST') ? segment.toLowerCase() : segment;
    };
    const segmentFn2 = (segment: string): string => {
      return segment.startsWith('Whether') ? segment.toLowerCase() : segment;
    };
    const result = fileParseBuilder({
      filePath: path.join(testDir, `test-file-1`),
      delimiterRules: {
        start: '-----',
        segment: '\n\n',
        end: '-----',
        segmentPipe: [segmentFn1, segmentFn2],
      },
    });
    expect(result.error).toBeNull();
    expect(result.segments).toHaveLength(4);
    expect(result.segments[0].startsWith('first')).toEqual(true);
    expect(result.segments[1].startsWith('whether')).toEqual(true);
    expect(fs.readdirSync(testDir)).toHaveLength(3);
  });
});
