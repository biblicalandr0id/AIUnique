from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from models.user_model import User, db
import re
from functools import wraps

auth = Blueprint('auth', __name__)

def validate_password(password):
    """Ensure password meets security requirements"""
    if len(password) < 8:
        return False
    if not re.search("[a-z]", password):
        return False
    if not re.search("[A-Z]", password):
        return False
    if not re.search("[0-9]", password):
        return False
    return True

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if not all(k in data for k in ['email', 'password', 'username']):
        return jsonify({'error': 'Missing required fields'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    if not validate_password(data['password']):
        return jsonify({'error': 'Password does not meet security requirements'}), 400
        
    user = User(
        email=data['email'],
        username=data['username'],
        password=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, current_app.config['SECRET_KEY'])
    
    return jsonify({'token': token})