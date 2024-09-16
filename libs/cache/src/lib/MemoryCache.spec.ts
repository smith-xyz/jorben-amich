import { MemoryCache } from './MemoryCache';

type TestingType = Partial<{
  id: number;
  text: string;
  additionalProp: boolean;
  extraText: string;
}>;

// 43 bytes
const smallItem = {
  id: 1,
  text: 'a bit longer of an object',
};
// 177 bytes
const largeItem = {
  id: 2,
  text: 'a bit longer of an object - should be removed',
  extraText:
    'adding way more than we need to the buffer, plus this should be a very large item anyway......!!!!!',
};

function reset(cache: MemoryCache<unknown, unknown>) {
  cache.clear();
  cache.close();
}

describe('MemoryCache', () => {
  jest.useFakeTimers();

  describe('basic map functionality', () => {
    const cache: MemoryCache<number, TestingType> = new MemoryCache(null, {
      ttl: 50000,
    });

    afterEach(() => reset(cache));

    it('will set items into cache and fetch the item', () => {
      cache.set(1, { id: 1, text: 'some string' });
      cache.set(2, { id: 2, text: 'some string' });
      cache.set(3, { id: 3, text: 'some string' });
      expect(cache.get(3)).toEqual({ id: 3, text: 'some string' });
    });

    it('will set items into cache and override existing and fetch the item', () => {
      cache.set(1, { id: 1, text: 'some string' });
      cache.set(2, { id: 2, text: 'some string' });
      cache.set(3, { id: 3, text: 'some string' });

      expect(cache.get(3)).toEqual({ id: 3, text: 'some string' });

      const newObject = { id: 3, text: 'new text', additionalProp: true };
      cache.set(3, newObject);

      expect(cache.get(3)).toEqual(newObject);
    });

    it('will clear items', () => {
      // in afterEach
      expect(cache.size).toEqual(0);
    });

    it('will append items', () => {
      cache.append([
        [1, { id: 1 }],
        [2, { id: 2 }],
      ]);
      expect(cache.size).toEqual(2);
      cache.append([
        [1, { id: 3 }],
        [2, { id: 4 }],
      ]);
      expect(cache.size).toEqual(2);
    });

    it('will set initial items', () => {
      const testCache = new MemoryCache([
        [1, { id: 1 }],
        [2, { id: 2 }],
      ]);
      expect(testCache.size).toEqual(2);
    });

    it('will delete items', () => {
      cache.append([
        [1, { id: 1 }],
        [2, { id: 2 }],
      ]);
      cache.delete(1);
      expect(cache.get(1)).toBeNull();
    });
  });

  describe('memory tests', () => {
    describe('largest removed strategy', () => {
      const cache: MemoryCache<number, TestingType> = new MemoryCache(null, {
        maxByteSize: 200,
        resizeStrategy: 'LARGEST',
      });

      afterEach(() => reset(cache));

      it('will remove largest items when strategy is largest and it has surpassed the byte size', () => {
        cache.set(1, smallItem);
        cache.set(2, largeItem);

        expect(cache.size).toEqual(1);
        expect(cache.get(2)).toBeNull();

        cache.set(2, smallItem);

        expect(cache.size).toEqual(2);

        cache.set(3, largeItem);

        expect(cache.size).toEqual(2);

        cache.clear();
        expect(cache.size).toEqual(0);

        cache.set(2, largeItem);
        expect(cache.get(2)).toEqual(largeItem);
      });

      it('will remove largest item when strategy is first and continually remove largest until the size is under the max', () => {
        cache.append([
          [1, smallItem],
          [2, largeItem],
          [3, largeItem],
          [4, largeItem],
        ]);
        expect(cache.size).toEqual(1);
      });
    });

    describe('first removed strategy', () => {
      const cache: MemoryCache<number, TestingType> = new MemoryCache(null, {
        maxByteSize: 200,
        resizeStrategy: 'FIRST',
      });

      afterEach(() => reset(cache));

      it('will remove first item when strategy is first and it has surpassed the byte size', () => {
        cache.set(1, smallItem);
        cache.set(2, largeItem);
        expect(cache.size).toEqual(1);
        expect(cache.get(1)).toBeNull();
      });

      it('will remove last item when strategy is first and continually remove last until the size is under the max', () => {
        cache.append([
          [1, smallItem],
          [2, largeItem],
          [3, smallItem],
        ]);
        expect(cache.size).toEqual(1);
        expect(cache.get(1)).toBeNull();
        expect(cache.get(2)).toBeNull();
        expect(cache.get(3)).not.toBeNull();
      });
    });

    describe('last removed strategy', () => {
      const cache: MemoryCache<number, TestingType> = new MemoryCache(null, {
        maxByteSize: 200,
        resizeStrategy: 'LAST',
      });

      afterEach(() => reset(cache));

      it('will remove first item when strategy is first and it has surpassed the byte size', () => {
        cache.set(1, smallItem);
        cache.set(2, largeItem);
        expect(cache.size).toEqual(1);
        expect(cache.get(1)).not.toBeNull();
      });

      it('will remove last item when strategy is first and continually remove last item until the size is under the max', () => {
        cache.append([
          [1, smallItem],
          [2, largeItem],
          [3, smallItem],
        ]);
        expect(cache.size).toEqual(1);
        expect(cache.get(1)).not.toBeNull();
      });
    });

    describe('stress test', () => {
      // caps at 99999999
      const cache: MemoryCache<number, TestingType> = new MemoryCache(null, {
        maxByteSize: 9999999999,
        resizeStrategy: 'LARGEST',
      });

      afterEach(() => reset(cache));

      it('capping the memory', () => {
        let id = 1;
        while (cache.cacheSize < 99999999 - 250) {
          cache.set(id, largeItem);
          id += 1;
        }
        expect(cache.get(1)).not.toBeNull();

        const currentSize = cache.size;

        cache.set(id + 1, largeItem);

        expect(cache.size).toEqual(currentSize);
      });
    });
  });

  describe('ttl test', () => {
    const cache: MemoryCache<number, TestingType> = new MemoryCache(null, {
      ttl: 1,
      maxByteSize: 900,
      resizeStrategy: 'FIRST',
    });

    afterEach(() => reset(cache));

    it('will return null when cached item expires', async () => {
      cache.set(1, smallItem);

      jest.advanceTimersByTime(1000);

      expect(cache.get(1)).toBeNull();

      cache.set(1, smallItem);
      expect(cache.get(1)).toEqual(smallItem);

      jest.advanceTimersByTime(1000);

      expect(cache.get(1)).toBeNull();
    });
  });

  describe('cache lifetime test', () => {
    const cache: MemoryCache<number, TestingType> = new MemoryCache(null, {
      ttl: 8000,
      expireCache: 1,
      maxByteSize: 900,
      resizeStrategy: 'FIRST',
    });

    afterEach(() => reset(cache));

    it('will return null when cached item expires', async () => {
      cache.set(1, smallItem);

      jest.advanceTimersByTime(1000);

      expect(cache.get(1)).toBeNull();

      cache.set(1, smallItem);
      expect(cache.get(1)).toEqual(smallItem);

      jest.advanceTimersByTime(1000);

      expect(cache.get(1)).toBeNull();
    });
  });
});
