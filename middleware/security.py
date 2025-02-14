from flask import request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import hashlib
import time

class SecurityMiddleware:
    def __init__(self, app):
        self.app = app
        self.limiter = Limiter(
            app,
            key_func=get_remote_address,
            default_limits=["200 per day", "50 per hour"]
        )
        
    def init_app(self, app):
        @app.before_request
        def before_request():
            # Add request timestamp
            request.start_time = time.time()
            
            # Validate content type for POST requests
            if request.method == 'POST':
                if not request.is_json:
                    return jsonify({'error': 'Content-Type must be application/json'}), 415
                    
            # Add security headers
            @app.after_request
            def add_security_headers(response):
                response.headers['Content-Security-Policy'] = "default-src 'self'"
                response.headers['X-Content-Type-Options'] = 'nosniff'
                response.headers['X-Frame-Options'] = 'DENY'
                response.headers['X-XSS-Protection'] = '1; mode=block'
                return response