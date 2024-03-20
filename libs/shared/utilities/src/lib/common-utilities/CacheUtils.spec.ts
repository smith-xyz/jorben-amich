import assert from 'assert';
import { CacheUtils } from './CacheUtils';

const { memoizeClassFunction, memoizeFunction } = CacheUtils;

let cacheValues = {};

const mockCacheGet = jest.fn().mockImplementation((key: string) => {
  if (cacheValues[key]) return cacheValues[key];
  return null;
});

const mockCacheSet = jest
  .fn()
  .mockImplementation((key: string, value: unknown) => {
    cacheValues[key] = value;
    return;
  });

const testCache = {
  get: mockCacheGet,
  set: mockCacheSet,
};

async function testMethodOne(test: number) {
  return test + 1;
}

function testMethodTwo(test: number) {
  return test + 2;
}

class TestClass {
  public property: string;
  constructor(property: string) {
    this.property = property;
  }
  public async methodOne(test: number) {
    assert.equal(this.property, 'test');
    return test + 1;
  }

  public methodTwo(test: number) {
    assert.equal(this.property, 'test');
    return test + 2;
  }
}

describe('Cache Utils', () => {
  describe('memoize', () => {
    const cls = new TestClass('test');

    beforeEach(() => {
      cacheValues = {};
      jest.clearAllMocks();
    });

    it('will set to cache on non cached values and then fetch from cache on repeated calls', async () => {
      await memoizeFunction(testMethodOne, testCache)(8);
      expect(mockCacheGet).toBeCalledTimes(1);
      expect(mockCacheGet).toBeCalledWith('[8]');
      expect(mockCacheSet).toBeCalledTimes(1);
      expect(mockCacheSet).toBeCalledWith('[8]', 9);

      await memoizeFunction(testMethodOne, testCache)(8);
      expect(mockCacheGet).toBeCalledTimes(2);
      expect(mockCacheSet).toBeCalledTimes(1);
    });

    it('will works for sync methods', async () => {
      memoizeFunction(testMethodTwo, testCache)(9);
      expect(mockCacheGet).toBeCalledTimes(1);
      expect(mockCacheGet).toBeCalledWith('[9]');
      expect(mockCacheSet).toBeCalledTimes(1);
      expect(mockCacheSet).toBeCalledWith('[9]', 11);

      memoizeFunction(testMethodTwo, testCache)(9);
      expect(mockCacheGet).toBeCalledTimes(2);
      expect(mockCacheSet).toBeCalledTimes(1);
    });

    it('will allow using custom keys', async () => {
      memoizeFunction(testMethodTwo, testCache, 'nine')(9);
      expect(mockCacheGet).toBeCalledTimes(1);
      expect(mockCacheGet).toBeCalledWith('nine');
      expect(mockCacheSet).toBeCalledTimes(1);
      expect(mockCacheSet).toBeCalledWith('nine', 11);

      memoizeFunction(testMethodTwo, testCache, 'nine')(9);
      expect(mockCacheGet).toBeCalledTimes(2);
      expect(mockCacheSet).toBeCalledTimes(1);
    });

    it('will can wrap class async methods', async () => {
      await memoizeClassFunction(cls, cls.methodOne, testCache, 'nine')(9);
      expect(mockCacheGet).toBeCalledTimes(1);
      expect(mockCacheGet).toBeCalledWith('nine');
      expect(mockCacheSet).toBeCalledTimes(1);
      expect(mockCacheSet).toBeCalledWith('nine', 10);

      await memoizeClassFunction(cls, cls.methodOne, testCache, 'nine')(9);
      expect(mockCacheGet).toBeCalledTimes(2);
      expect(mockCacheSet).toBeCalledTimes(1);
    });
    it('will can wrap class sync methods', async () => {
      memoizeClassFunction(cls, cls.methodTwo, testCache, 'nine')(9);
      expect(mockCacheGet).toBeCalledTimes(1);
      expect(mockCacheGet).toBeCalledWith('nine');
      expect(mockCacheSet).toBeCalledTimes(1);
      expect(mockCacheSet).toBeCalledWith('nine', 11);

      memoizeClassFunction(cls, cls.methodTwo, testCache, 'nine')(9);
      expect(mockCacheGet).toBeCalledTimes(2);
      expect(mockCacheSet).toBeCalledTimes(1);
    });
  });
});
