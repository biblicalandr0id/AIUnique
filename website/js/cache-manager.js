export class CacheManager {
    constructor() {
        this.cache = new Map();
        this.maxAge = 5 * 60 * 1000; // 5 minutes
    }

    set(key, value, customMaxAge = null) {
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            maxAge: customMaxAge || this.maxAge
        });
    }

    get(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        if (Date.now() - item.timestamp > item.maxAge) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    clear() {
        this.cache.clear();
    }

    invalidate(key) {
        this.cache.delete(key);
    }
}