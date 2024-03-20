export interface IMemoryCache<K = string, V = unknown> {
  size: number;
  get: <Data = V>(key: K) => Data;
  set: <Data = V>(key: K, value: Data) => this;
  delete: (key: K) => boolean;
  append: <Data = V>(entries: readonly (readonly [K, Data])[] | null) => this;
  clear: () => void;
  close: () => void;
}

export interface DataStoreOptions {
  [x: string]: {
    get: <T>() => Promise<T>;
    set: <T>() => Promise<T>;
  };
}

type ResizeStrategy = 'LARGEST' | 'FIRST' | 'LAST';

export interface CacheOptions {
  /**
   * ttl for cached items in seconds
   */
  ttl?: number;
  /**
   * ttl for entire cache to be cleared in seconds
   */
  expireCache?: number;
  /**
   * max byte size of objects to store
   */
  maxByteSize: number;
  /**
   * resize strategy when cache byte size surpasses the max
   */
  resizeStrategy: ResizeStrategy;
}

interface CacheObject {
  size: number;
  expiresAt?: number;
  buffer: Buffer;
}

export class MemoryCache<K = string, V = unknown>
  implements IMemoryCache<K, V>
{
  public cacheSize = 0;

  private readonly hashMap = new Map<K, CacheObject>();

  private intervalJob: NodeJS.Timeout;

  constructor();
  constructor(
    entries?: readonly (readonly [K, V])[],
    options?: Partial<CacheOptions>
  );
  constructor(
    entries: readonly (readonly [K, V])[] | null = null,
    private readonly options: CacheOptions = {
      maxByteSize: null,
      resizeStrategy: 'LARGEST',
    }
  ) {
    if (this.options.maxByteSize >= 99999999)
      this.options.maxByteSize = 99999999;
    if (entries) {
      this.hashMap = new Map(
        Array.from(entries).map(([k, v]) => {
          const buffer = this.toCacheBufferObject(v);
          return [k, buffer];
        })
      );
      this.calculateTotalSize();
    }

    if (options.expireCache && options.expireCache > 0)
      this.startExpires(options.expireCache * 1000);
  }

  public get<Data = V>(key: K): Data {
    return this.getBufferItemTyped(key);
  }

  public set<Data = V>(key: K, value: Data) {
    if (this.hashMap.has(key)) {
      const currentBufferItem = this.hashMap.get(key);
      this.cacheSize -= currentBufferItem.size;
    }
    const newBufferItem = this.toCacheBufferObject(value);
    this.hashMap.set(key, newBufferItem);
    this.cacheSize += newBufferItem.size;
    if (this.cacheSize > this.maxCacheByteSize) {
      this.executeResize();
    }
    return this;
  }

  public delete(key: K) {
    if (!this.hashMap.has(key)) return false;
    const current = this.hashMap.get(key);
    this.hashMap.delete(key);
    this.cacheSize -= current.size;
    return true;
  }

  public clear() {
    this.hashMap.clear();
    this.cacheSize = 0;
  }

  public get size() {
    return this.hashMap.size;
  }

  public append<Data = V>(entries: readonly (readonly [K, Data])[] | null) {
    for (const [key, value] of entries) {
      const buffer = this.toCacheBufferObject(value);
      this.hashMap.set(key, buffer);
    }
    this.calculateTotalSize();
    if (this.cacheSize > this.maxCacheByteSize) {
      this.executeResize();
    }
    return this;
  }

  public close() {
    clearInterval(this.intervalJob);
  }

  private calculateTotalSize() {
    let totalSize = 0;
    for (const { size } of this.hashMap.values()) {
      totalSize += size;
    }
    this.cacheSize = totalSize;
  }

  private getBufferItemTyped<Data = V>(key: K): Data {
    const bufferItem = this.hashMap.get(key);
    if (bufferItem) {
      const expired = this.isExpired(bufferItem);
      return expired ? null : this.toTypedObject(bufferItem.buffer);
    }
    return null;
  }

  private getLargetCacheBufferItem(): [K, CacheObject] {
    const sorted = Array.from(this.hashMap.entries()).sort(
      (a, b) => b[1].size - a[1].size
    );
    return sorted[0];
  }

  private toCacheBufferObject<Data>(value: V | Data) {
    const newBufferItem = Buffer.from(JSON.stringify(value));
    const cacheObject = {
      size: newBufferItem.byteLength,
      buffer: newBufferItem,
      expiresAt: null,
    };
    if (this.options.ttl) this.setTtl(this.options.ttl, cacheObject);
    return cacheObject;
  }

  private toTypedObject<Data = V>(value: Buffer): Data {
    return JSON.parse(value.toString());
  }

  private executeResize() {
    switch (this.options.resizeStrategy) {
      case 'FIRST':
        return this.removeFirst();
      case 'LAST':
        return this.removeLast();
      default:
        return this.removeLargest();
    }
  }

  private removeLargest() {
    const largest = this.getLargetCacheBufferItem();
    if (largest) {
      this.hashMap.delete(largest[0]);
      this.cacheSize -= largest[1].size;
    }
    if (this.cacheSize > this.maxCacheByteSize) {
      this.removeLargest();
    }
  }

  private removeFirst() {
    const temp = Array.from(this.hashMap.entries())[0];
    this.hashMap.delete(temp[0]);
    this.cacheSize -= temp[1].size;

    if (this.cacheSize > this.maxCacheByteSize) {
      this.removeFirst();
    }
  }

  private removeLast() {
    const temp = Array.from(this.hashMap.entries());
    const last = temp[temp.length - 1];
    this.hashMap.delete(last[0]);
    this.cacheSize -= last[1].size;

    if (this.cacheSize > this.maxCacheByteSize) {
      this.removeLast();
    }
  }

  private get maxCacheByteSize() {
    return this.options.maxByteSize ?? this.cacheSize;
  }

  private setTtl(ttl: number, object: CacheObject) {
    if (!object.expiresAt) {
      object.expiresAt = Date.now() + ttl * 1000;
    }
  }

  private isExpired(object: CacheObject) {
    if (object.expiresAt) {
      return Date.now() > object.expiresAt;
    }
    return false;
  }

  private startExpires(time: number) {
    this.intervalJob = setInterval(() => this.clear(), time);
  }
}
