from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from models.user import User
from models.model_catalog import ModelCatalog
from config import Config
import stripe
import jwt
from functools import wraps
import zipfile
import io
import os

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
stripe.api_key = app.config['STRIPE_SECRET_KEY']

catalog = ModelCatalog()
User.init_db()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token.split()[1], 
                            app.config['SECRET_KEY'], 
                            algorithms=["HS256"])
            current_user = data['username']
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User ▋