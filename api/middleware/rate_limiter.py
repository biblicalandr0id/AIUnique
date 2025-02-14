from flask import request, jsonify
import redis
from functools import wraps
import time

class RateLimiter:
    def __init__(self, redis_url="redis://localhost:6379/0"):
        self.redis = redis.from_url(redis_url)
        
    def limit(self, requests=100, window=60):
        def decorator(f):
            @wraps(f)
            def wrapped(*args, **kwargs):
                key = f"rate_limit:{request.remote_addr}:{f.__name__}"
                current = self.redis.get(key)
                
                if current is None:
                    self.redis.setex(key, window, 1)
                    return f(*args, **kwargs)
                    
                if int(current) >= requests:
                    return jsonify({
                        'error': 'Rate limit exceeded',
                        'retry_after': self.redis.ttl(key)
                    }), 429
                    
                self.redis.incr(key)
                return f(*args, **kwargs)
            return wrapped
        return decorator