# Created: 2025-02-14 10:44:48 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/models/payment.py ✓
# - Dependencies: 
#   - backend/api/app.py (2025-02-14 10:34:19 UTC) ✓
#   - backend/models/user.py (2025-02-14 10:36:54 UTC) ✓
# - Required imports available ✓

from backend.api.app import db
from datetime import datetime

class Purchase(db.Model):
    __tablename__ = 'purchases'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    model_id = db.Column(db.Integer, db.ForeignKey('ai_models.id'), nullable=False)
    transaction_id = db.Column(db.String(100), unique=True, nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='USD')
    status = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Purchase {self.id}: {self.transaction_id}>'