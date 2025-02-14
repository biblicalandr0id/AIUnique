# Created: 2025-02-14 10:44:48 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/services/auth/jwt_service.py ✓
# - Dependencies: All previous components ✓
# - Required imports available ✓

import jwt
from datetime import datetime, timedelta
from flask import current_app
from backend.models.user import User

class JWTService:
    @staticmethod
    def generate_token(user_id):
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow()
        }
        return jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )

    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None