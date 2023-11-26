import { Log } from './Log';

const formatter = (
  serviceName: string,
  method: string,
  arg1: number,
  arg2: number
) => {
  const base = `SERVICE=${serviceName} METHOD=${method} VALUE=${arg1}`;
  if (arg2) {
    return `${base} VALUE2=${arg2}`;
  }

  return base;
};

class TestClass {
  @Log('log', formatter)
  public testLogMethod(arg1: number) {
    return arg1;
  }

  @Log('warn', formatter)
  public testWarnMethod(arg1: number) {
    return arg1;
  }
  @Log('debug', formatter)
  public testDebugMethod(arg1: number) {
    return arg1;
  }
  @Log('error', formatter)
  public testErrorMethod(arg1: number) {
    return arg1;
  }

  @Log('log', formatter)
  public testLogMultiArgs(arg1: number, arg2: number) {
    return arg1 + arg2;
  }

  @Log('log')
  public testLogDefaultFormatter(arg1: number, arg2: number) {
    return arg1 + arg2;
  }
}

const testClass = new TestClass();

const logMock = jest.fn();
const warnMock = jest.fn();
const errorMock = jest.fn();
const debugMock = jest.fn();

jest
  .spyOn(global.console, 'log')
  .mockImplementation((...args: unknown[]) => logMock(...args));

jest
  .spyOn(global.console, 'warn')
  .mockImplementation((...args: unknown[]) => warnMock(...args));

jest
  .spyOn(global.console, 'debug')
  .mockImplementation((...args: unknown[]) => debugMock(...args));

jest
  .spyOn(global.console, 'error')
  .mockImplementation((...args: unknown[]) => errorMock(...args));

describe('Log Decorator', () => {
  afterEach(jest.clearAllMocks);
  it('will execute the log level logging with custom formatted logging message', () => {
    testClass.testLogMethod(1);
    expect(logMock).toHaveBeenCalledWith(
      `SERVICE=TestClass METHOD=testLogMethod VALUE=1`
    );
  });

  it('will execute the warn level logging with custom formatted logging message', () => {
    testClass.testWarnMethod(2);
    expect(warnMock).toHaveBeenCalledWith(
      `SERVICE=TestClass METHOD=testWarnMethod VALUE=2`
    );
  });

  it('will execute the debug level logging with custom formatted logging message', () => {
    testClass.testDebugMethod(3);
    expect(debugMock).toHaveBeenCalledWith(
      `SERVICE=TestClass METHOD=testDebugMethod VALUE=3`
    );
  });

  it('will execute the error level logging with custom formatted logging message', () => {
    testClass.testErrorMethod(4);
    expect(errorMock).toHaveBeenCalledWith(
      `SERVICE=TestClass METHOD=testErrorMethod VALUE=4`
    );
  });

  it('will execute the log level logging with custom formatted logging and multiple args', () => {
    testClass.testLogMultiArgs(1, 2);
    expect(logMock).toHaveBeenCalledWith(
      `SERVICE=TestClass METHOD=testLogMultiArgs VALUE=1 VALUE2=2`
    );
  });

  it('will execute the log level logging with default formatted logging and multiple args', () => {
    testClass.testLogDefaultFormatter(1, 2);
    expect(logMock).toHaveBeenCalledWith(
      `Class=TestClass METHOD=testLogDefaultFormatter ARG1=1 ARG2=2`
    );
  });
});
