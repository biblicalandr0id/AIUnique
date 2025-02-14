from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
from middleware.security import SecurityMiddleware
from utils.error_handler import setup_logging, handle_errors
from models.user_model import db
from auth import auth

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['STRIPE_SECRET_KEY'] = os.getenv('STRIPE_SECRET_KEY')
    app.config['STRIPE_PUBLISHABLE_KEY'] = os.getenv('STRIPE_PUBLISHABLE_KEY')
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    Migrate(app, db)
    SecurityMiddleware(app)
    
    # Setup logging
    setup_logging()
    
    # Register blueprints
    app.register_blueprint(auth, url_prefix='/auth')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=False)