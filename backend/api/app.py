# Created: 2025-02-14 10:34:19 UTC by biblicalandr0id
# Last modified: 2025-02-14 10:34:19 UTC by biblicalandr0id
# Dependencies: None
# Validation: Initial core component

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
import os
from dotenv import load_dotenv

# Initialize Flask application
app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

# Configuration
app.config.update(
    SECRET_KEY=os.getenv('SECRET_KEY'),
    SQLALCHEMY_DATABASE_URI=os.getenv('DATABASE_URL'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    STRIPE_SECRET_KEY=os.getenv('STRIPE_SECRET_KEY'),
    STRIPE_PUBLISHABLE_KEY=os.getenv('STRIPE_PUBLISHABLE_KEY'),
    UPLOAD_FOLDER=os.getenv('UPLOAD_FOLDER', 'uploads'),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16MB max file size
    REDIS_URL=os.getenv('REDIS_URL', 'redis://localhost:6379/0')
)

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Import routes after db initialization
from api.routes import auth, models, payments, downloads

# Register blueprints
app.register_blueprint(auth.bp, url_prefix='/api/auth')
app.register_blueprint(models.bp, url_prefix='/api/models')
app.register_blueprint(payments.bp, url_prefix='/api/payments')
app.register_blueprint(downloads.bp, url_prefix='/api/downloads')

@app.before_request
def before_request():
    request.start_time = datetime.utcnow()

@app.after_request
def after_request(response):
    # Add security headers
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # Log request completion
    duration = datetime.utcnow() - request.start_time
    print(f"Request completed in {duration.total_seconds():.2f}s")
    
    return response

@app.errorhandler(Exception)
def handle_error(error):
    code = getattr(error, 'code', 500)
    return jsonify({
        'error': str(error),
        'timestamp': datetime.utcnow().isoformat()
    }), code

if __name__ == '__main__':
    app.run(debug=os.getenv('FLASK_ENV ▋