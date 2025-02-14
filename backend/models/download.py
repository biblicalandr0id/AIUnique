# Created: 2025-02-14 10:44:48 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/models/download.py ✓
# - Dependencies: 
#   - backend/api/app.py (2025-02-14 10:34:19 UTC) ✓
#   - backend/models/user.py (2025-02-14 10:36:54 UTC) ✓
# - Required imports available ✓

from backend.api.app import db
from datetime import datetime

class Download(db.Model):
    __tablename__ = 'downloads'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    model_id = db.Column(db.Integer, db.ForeignKey('ai_models.id'), nullable=False)
    download_date = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))  # IPv6 compatible
    success = db.Column(db.Boolean, default=True)
    
    def __repr__(self):
        return f'<Download {self.id}: User {self.user_id}>'