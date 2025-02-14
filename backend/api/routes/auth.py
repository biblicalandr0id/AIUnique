# Created: 2025-02-14 10:48:07 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/api/routes/auth.py ✓
# - Dependencies: 
#   - backend/api/app.py (10:34:19) ✓
#   - backend/models/user.py (10:36:54) ✓
#   - backend/services/auth/jwt_service.py (10:44:48) ✓
#   - backend/services/auth/password_service.py (10:44:48) ✓

from flask import Blueprint, request, jsonify
from backend.models.user import User
from backend.services.auth.jwt_service import JWTService
from backend.services.auth.password_service import PasswordService
from backend.api.app import db

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username taken'}), 400
    
    # Validate password
    is_valid, msg = PasswordService.validate_password_strength(data['password'])
    if not is_valid:
        return jsonify({'error': msg}), 400
    
    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    token = JWTService.generate_token(user.id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = JWTService.generate_token(user.id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })

@bp.route('/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'No token provided'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = JWTService.verify_token(token)
    
    if not user_id:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    user = User.query.get(user_id)
    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })