# Created: 2025-02-14 10:48:07 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/api/routes/models.py ✓
# - Dependencies: 
#   - backend/api/app.py (10:34:19) ✓
#   - backend/models/model.py (10:36:54) ✓
#   - backend/services/auth/jwt_service.py (10:44:48) ✓

from flask import Blueprint, jsonify, request
from backend.models.model import AIModel
from backend.api.app import db
from functools import wraps
from backend.services.auth.jwt_service import JWTService

bp = Blueprint('models', __name__)

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split(' ')[1]
        user_id = JWTService.verify_token(token)
        
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        return f(*args, **kwargs)
    return decorated

@bp.route('/list', methods=['GET'])
def list_models():
    models = AIModel.query.all()
    return jsonify({
        'models': [{
            'id': model.id,
            'name': model.name,
            'description': model.description,
            'version': model.version,
            'price': float(model.price),
            'architecture': model.architecture,
            'accuracy': model.accuracy
        } for model in models]
    })

@bp.route('/<int:model_id>', methods=['GET'])
def get_model(model_id):
    model = AIModel.query.get_or_404(model_id)
    return jsonify({
        'id': model.id,
        'name': model.name,
        'description': model.description,
        'version': model.version,
        'price': float(model.price),
        'architecture': model.architecture,
        'training_time': model.training_time,
        'memory_usage': model.memory_usage,
        'accuracy': model.accuracy
    })