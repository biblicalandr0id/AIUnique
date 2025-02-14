import logging
from functools import wraps
from flask import jsonify
import traceback

logger = logging.getLogger(__name__)

def setup_logging():
    logging.basicConfig(
        filename='app.log',
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s %(message)s'
    )

def handle_errors(f):
    @wraps(f)
    def wrapped(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error: {str(e)}\n{traceback.format_exc()}")
            return jsonify({
                'error': 'An unexpected error occurred',
                'message': str(e)
            }), 500
    return wrapped