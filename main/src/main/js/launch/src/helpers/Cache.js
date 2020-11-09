export const CACHE_5_MIN = 50000; // 5 Min.
export const CACHE_10_MIN = 100000; // 10 Min.
export const CACHE_1_HOUR = 600000; // 1 Hour.
export const CACHE_EXPIRATION_DEFAULT = CACHE_10_MIN;

export class CacheStorageAdapterAbstract {
  constructor(prefix = "Cache") {
    this.prefix = prefix;
  }

  makeKey = (key) => {
    return `${this.prefix}:${key}`;
  };
}

export class SessionStorageAdapter extends CacheStorageAdapterAbstract {
  constructor(prefix = "SessionStorageAdapter") {
    super(prefix);
  }

  getItem(key) {
    const data = window.sessionStorage.getItem(this.makeKey(key));
    try {
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {}
  }

  setItem(key, data) {
    window.sessionStorage.setItem(this.makeKey(key), JSON.stringify(data));
  }
}

export class LocalStorageAdapter extends CacheStorageAdapterAbstract {
  constructor(prefix = "LocalStorageAdapter") {
    super(prefix);
  }

  getItem(key) {
    const data = window.localStorage.getItem(this.makeKey(key));
    try {
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {}
  }

  setItem(key, data) {
    window.localStorage.setItem(this.makeKey(key), JSON.stringify(data));
  }
}

export class MemoryAdapter extends CacheStorageAdapterAbstract {
  constructor(prefix = "MemoryAdapter") {
    super(prefix);
    this._store = {};
  }

  getItem(key) {
    return this._store[this.makeKey(key)];
  }

  setItem(key, data) {
    this._store[this.makeKey(key)] = data;
  }
}

export class CacheApi {
  constructor(adapter) {
    this._adapter = adapter;
    this.cache.bind(this);
  }

  async cache(KEY, callback, ttl = CACHE_EXPIRATION_DEFAULT) {
    const item = this._adapter.getItem(KEY);
    if (item) {
      const { value: cached, expiration } = item;
      if (expiration > Date.now()) {
        return cached;
      }
    }

    const value = await callback();
    this._adapter.setItem(KEY, {
      expiration: Date.now() + ttl,
      value,
    });

    return value;
  }
}

const Cache = new CacheApi(new MemoryAdapter());
export default Cache;
