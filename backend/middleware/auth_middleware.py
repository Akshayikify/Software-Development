from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify

def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            return fn(current_user, *args, **kwargs)
        except Exception as e:
            return jsonify({'message': 'Authentication required'}), 401
    return wrapper
