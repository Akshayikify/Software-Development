from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from controllers import auth_controller, watchlist_controller
from middleware import auth_required
from database import test_connection
from .database.db import get_db_connection

app = Flask(__name__)
app.config.from_object(Config)

# CORS configuration
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
    "supports_credentials": True,
    "methods": ["GET", "POST", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

# JWT setup
jwt = JWTManager(app)

# Test database connection
@app.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        conn = get_db_connection()
        if conn:
            cursor = conn.cursor()
            cursor.execute('SELECT 1')
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Database connection successful', 'result': result}), 200
        else:
            return jsonify({'message': 'Database connection failed'}), 500
    except Exception as e:
        return jsonify({'message': f'Database connection failed: {str(e)}'}), 500

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    return auth_controller.register()

@app.route('/api/auth/login', methods=['POST'])
def login():
    return auth_controller.login()

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    return auth_controller.logout()

@app.route('/api/auth/check', methods=['GET'])
@auth_required
def check_auth(current_user):
    return auth_controller.check_auth(current_user)

# Watchlist routes
@app.route('/api/watchlist', methods=['GET'])
@auth_required
def get_watchlist(current_user):
    return watchlist_controller.get_watchlist(current_user)

@app.route('/api/watchlist', methods=['POST'])
@auth_required
def add_to_watchlist(current_user):
    return watchlist_controller.add_to_watchlist(current_user)

@app.route('/api/watchlist/<coin_id>', methods=['DELETE'])
@auth_required
def remove_from_watchlist(current_user, coin_id):
    return watchlist_controller.remove_from_watchlist(current_user, coin_id)

if __name__ == '__main__':
    test_connection()
    app.run(port=Config.PORT, debug=True)