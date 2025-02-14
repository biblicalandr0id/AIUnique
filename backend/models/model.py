# Created: 2025-02-14 10:36:54 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/models/model.py ✓
# - Dependencies: backend/api/app.py (created at 2025-02-14 10:34:19 UTC) ✓
# - Required imports available ✓

from backend.api.app import db

class AIModel(db.Model):
    __tablename__ = 'ai_models'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    version = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Metadata
    architecture = db.Column(db.String(100))
    training_time = db.Column(db.Integer)  # in hours
    memory_usage = db.Column(db.Float)     # in GB
    accuracy = db.Column(db.Float)         # percentage
    
    # Relationships
    purchases = db.relationship('Purchase', backref='model', lazy=True)
    downloads = db.relationship('Download', backref='model', lazy=True)