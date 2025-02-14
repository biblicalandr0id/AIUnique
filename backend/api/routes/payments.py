# Created: 2025-02-14 10:49:48 UTC by biblicalandr0id
# Structure Validation:
# - Path matches: /backend/api/routes/payments.py ✓
# - Dependencies: 
#   - backend/api/app.py (10:34:19) ✓
#   - backend/models/payment.py (10:44:48) ✓
#   - backend/models/user.py (10:36:54) ✓

import stripe
from flask import Blueprint, jsonify, request, current_app
from backend.models.payment import Purchase
from backend.models.user import User
from backend.models.model import AIModel
from backend.api.app import db
from backend.services.auth.jwt_service import JWTService

bp = Blueprint('payments', __name__)

stripe.api_key = current_app.config['STRIPE_SECRET_KEY']

def get_user_from_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    token = auth_header.split(' ')[1]
    user_id = JWTService.verify_token(token)
    if not user_id:
        return None
    return User.query.get(user_id)

@bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    user = get_user_from_token()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.get_json()
    model_id = data.get('model_id')
    
    if not model_id:
        return jsonify({'error': 'Model ID required'}), 400

    model = AIModel.query.get_or_404(model_id)
    
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=int(float(model.price) * 100),  # Convert to cents
            currency='usd',
            metadata={
                'user_id': user.id,
                'model_id': model_id
            }
        )
        
        return jsonify({
            'clientSecret': payment_intent.client_secret
        })
        
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/confirm-payment', methods=['POST'])
def confirm_payment():
    user = get_user_from_token()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    data = request.get_json()
    payment_intent_id = data.get('payment_intent_id')
    model_id = data.get('model_id')

    if not payment_intent_id or not model_id:
        return jsonify({'error': 'Missing required information'}), 400

    try:
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if payment_intent.status != 'succeeded':
            return jsonify({'error': 'Payment not successful'}), 400

        model = AIModel.query.get_or_404(model_id)
        
        purchase = Purchase(
            user_id=user.id,
            model_id=model_id,
            transaction_id=payment_intent_id,
            amount=float(model.price),
            currency='USD',
            status='completed'
        )
        
        db.session.add(purchase)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'purchase_id': purchase.id
        })

    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/purchase-history', methods=['GET'])
def purchase_history():
    user = get_user_from_token()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401

    purchases = Purchase.query.filter_by(user_id=user.id).order_by(Purchase.created_at.desc()).all()
    
    return jsonify({
        'purchases': [{
            'id': p.id,
            'model_id': p.model_id,
            'transaction_id': p.transaction_id,
            'amount': float(p.amount),
            'currency': p.currency,
            'status': p.status,
            'created_at': p.created_at.isoformat()
        } for p in purchases]
    })

@bp.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, current_app.config['STRIPE_WEBHOOK_SECRET']
        )
    except ValueError as e:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError as e:
        return jsonify({'error': 'Invalid signature'}), 400

    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object
        user_id = payment_intent.metadata.get('user_id')
        model_id = payment_intent.metadata.get('model_id')

        purchase = Purchase.query.filter_by(transaction_id=payment_intent.id).first()
        if purchase:
            purchase.status = 'completed'
            db.session.commit()

    return jsonify({'status': 'success'})