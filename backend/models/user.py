# Created: 2025-02-14 10:36:54 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/models/user.py ✓
# - Dependencies: backend/api/app.py (created at 2025-02-14 10:34:19 UTC) ✓
# - Required imports available ✓

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from backend.api.app import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    purchases = db.relationship('Purchase', backref='user', lazy=True)
    downloads = db.relationship('Download', backref='user', lazy=True)
    settings = db.relationship('UserSettings', backref='user', uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)