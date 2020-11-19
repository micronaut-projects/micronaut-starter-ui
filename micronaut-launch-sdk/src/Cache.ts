export const CACHE_1_MIN = 1000 * 60 // 5 Min.
export const CACHE_5_MIN = CACHE_1_MIN * 5 // 5 Min.
export const CACHE_10_MIN = CACHE_1_MIN * 10 // 10 Min.
export const CACHE_1_HOUR = CACHE_1_MIN * 60 // 1 Hour.
export const CACHE_1_DAY = CACHE_1_HOUR * 24 // 1 Hour.
export const CACHE_EXPIRATION_DEFAULT = CACHE_10_MIN

type CacheEntry<T> = {
    value: T
    expiration: Number
}

type CachingFn<T> = () => T

export abstract class CacheStorageAdapterAbstract {
    prefix: string
    constructor(prefix = 'Cache') {
        this.prefix = prefix
    }

    makeKey = (key: string): string => {
        return `${this.prefix}:${key}`
    }

    abstract getItem<T>(key: string): CacheEntry<T> | undefined
    abstract setItem<T>(key: string, data: CacheEntry<T>): void
}

export class SessionStorageAdapter extends CacheStorageAdapterAbstract {
    constructor(prefix = 'SessionStorageAdapter') {
        super(prefix)
    }

    getItem<T>(key: string): CacheEntry<T> | undefined {
        const data = window.sessionStorage.getItem(this.makeKey(key))
        try {
            if (data) {
                return JSON.parse(data) as CacheEntry<T>
            }
        } catch (error) {}
    }

    setItem<T>(key: string, data: CacheEntry<T>) {
        window.sessionStorage.setItem(this.makeKey(key), JSON.stringify(data))
    }
}

export class LocalStorageAdapter extends CacheStorageAdapterAbstract {
    constructor(prefix = 'LocalStorageAdapter') {
        super(prefix)
    }

    getItem<T>(key: string): CacheEntry<T> | undefined {
        const data = window.localStorage.getItem(this.makeKey(key))
        try {
            if (data) {
                return JSON.parse(data) as CacheEntry<T>
            }
        } catch (error) {}
    }

    setItem<T>(key: string, data: CacheEntry<T>) {
        window.localStorage.setItem(this.makeKey(key), JSON.stringify(data))
    }
}

export class MemoryAdapter extends CacheStorageAdapterAbstract {
    _store: Record<string, CacheEntry<any>>

    constructor(prefix = 'MemoryAdapter') {
        super(prefix)
        this._store = {} as Record<string, any>
    }

    getItem<T>(key: string): CacheEntry<T> {
        return this._store[this.makeKey(key)] as CacheEntry<T>
    }

    setItem<T>(key: string, data: CacheEntry<any>): void {
        this._store[this.makeKey(key)] = data
    }
}

export class CacheApi {
    private _adapter: CacheStorageAdapterAbstract

    constructor(adapter: CacheStorageAdapterAbstract) {
        this._adapter = adapter
        this.cache.bind(this)
    }

    async cache<T>(
        KEY: string,
        callback: () => Promise<T>,
        ttl = CACHE_EXPIRATION_DEFAULT
    ) {
        const item = this._adapter.getItem<T>(KEY)
        if (item) {
            const { value: cached, expiration } = item
            if (expiration > Date.now()) {
                return cached
            }
        }

        const value = await callback()
        this._adapter.setItem(KEY, {
            expiration: Date.now() + ttl,
            value,
        })

        return value
    }
}

const Cache = new CacheApi(new MemoryAdapter())
export default Cache
