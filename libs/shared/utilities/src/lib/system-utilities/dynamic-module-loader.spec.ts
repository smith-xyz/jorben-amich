import { dynamicModulesLoader } from './dynamic-module-loader';
import * as fs from 'fs';
import * as path from 'path';

const testDir = __dirname + '/test_temp_dml';
const testModuleOne = `
  module.exports = { test: true, testFn: () => true }
`;

function reset(dirName: string) {
  if (fs.existsSync(testDir)) {
    const files = fs.readdirSync(testDir);
    for (const file of files) {
      fs.rmSync(path.join(dirName, file));
    }
    fs.rmdirSync(testDir);
  }
}

describe('dynamicModulesLoader', () => {
  beforeAll(async () => {
    reset(testDir);
    fs.mkdirSync(testDir);
    fs.writeFileSync(path.join(testDir, 'TestModuleOne.js'), testModuleOne);
  });

  afterAll(() => {
    reset(testDir);
  });
  it('should load modules from provided directory', () => {
    const modules = dynamicModulesLoader<{
      test: boolean;
      testFn: () => boolean;
    }>(testDir);
    expect(modules.length).toEqual(1);
    expect(modules[0].test).toEqual(true);
    expect(modules[0].testFn()).toEqual(true);
  });
});
