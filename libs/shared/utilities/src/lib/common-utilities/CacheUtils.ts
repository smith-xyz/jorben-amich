import safeStringify from 'fast-safe-stringify';

interface CacheBase<K = string, V = unknown> {
  get: <Data = V>(key: K) => Data;
  set: <Data = V>(key: K, value: Data) => this;
}

type MemoizeFunction<T> = (...args: unknown[]) => T | Promise<T>;

function memoizeFunction<T>(
  fn: MemoizeFunction<T>,
  cache: CacheBase,
  key?: string
): MemoizeFunction<T> {
  return createWrapperFunction(fn, fn, cache, key);
}

function memoizeClassFunction<Klass, T>(
  target: Klass,
  fn: MemoizeFunction<T>,
  cache: CacheBase,
  key?: string
): MemoizeFunction<T> {
  return createWrapperFunction(target, fn, cache, key);
}

function createWrapperFunction<T>(
  target: unknown,
  fn: MemoizeFunction<T>,
  cache: CacheBase,
  key = null
): MemoizeFunction<T> {
  return async function (...args: unknown[]): Promise<T> {
    const cacheKey = key || argsToStringKey(...args);
    const cacheResult = cache.get<T>(cacheKey);
    if (cacheResult) {
      console.log(
        'Fetched from cache: ',
        safeStringify({
          source: fn['name'] ?? 'unknown',
          cacheKey,
        })
      );
      return cacheResult;
    }
    let newResult = fn.call(target, ...args);
    if (newResult instanceof Promise) {
      newResult = await newResult;
    }
    cache.set(cacheKey, newResult);
    return newResult;
  };
}

function argsToStringKey(...args: unknown[]) {
  return safeStringify(args);
}

export const CacheUtils = {
  memoizeFunction,
  memoizeClassFunction,
};
