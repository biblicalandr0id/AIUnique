# Created: 2025-02-14 10:44:48 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/services/auth/password_service.py ✓
# - Dependencies: All previous components ✓
# - Required imports available ✓

import bcrypt
from backend.models.user import User

class PasswordService:
    @staticmethod
    def hash_password(password):
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode(), salt)

    @staticmethod
    def verify_password(password, hashed):
        return bcrypt.checkpw(password.encode(), hashed)

    @staticmethod
    def validate_password_strength(password):
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        
        if not (has_upper and has_lower and has_digit):
            return False, "Password must contain uppercase, lowercase, and digits"
            
        return True, "Password meets requirements"