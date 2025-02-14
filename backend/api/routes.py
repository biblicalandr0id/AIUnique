from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import stripe
from datetime import datetime
from ..models.catalog import ModelCatalog
from ..models.storage import ModelStorage

app = Flask(__name__)
CORS(app)
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

catalog = ModelCatalog()
storage = ModelStorage()

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get all models from catalog"""
    return jsonify(catalog.models)

@app.route('/api/models/<model_id>', methods=['GET'])
def get_model(model_id):
    """Get specific model details"""
    model = catalog.get_model(model_id)
    if model:
        return jsonify(model)
    return jsonify({"error": "Model not found"}), 404

@app.route('/api/models', methods=['POST'])
def add_model():
    """Add a new model to the catalog"""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    model_data = request.form.to_dict()
    
    # Save model file
    filename = secure_filename(file.filename)
    file_path = storage.save_model_file(file, filename)
    
    # Add to catalog
    model_data['model_file'] = file_path
    model_data['date_added'] = datetime.utcnow().strftime("%Y-%m-%d")
    catalog.add_model(model_data)
    
    return jsonify({"message": "Model added successfully"})

@app.route('/api/purchase', methods=['POST'])
def create_purchase():
    """Create a purchase session"""
    try:
        data = request.json
        model_id = data['model_id']
        model = catalog.get_model(model_id)
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': model['name'],
                    },
                    'unit_amount': int(model['price'] * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=request.host_url + 'success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=request.host_url + 'cancel',
        )
        
        return jsonify({'session_id': session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/download/<model_id>', methods=['GET'])
def download_model(model_id):
    """Download model file after purchase verification"""
    # Verify purchase here
    model = catalog.get_model(model_id)
    if model:
        return send_file(model['model_file'])
    return jsonify({"error": "Model not found"}), 404