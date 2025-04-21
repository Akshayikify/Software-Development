from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from database.models import Database
from utils.helpers import hash_password, check_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "Missing required fields"}), 400
    
    with Database() as db:
        # Check if user already exists
        db.execute("SELECT id FROM users WHERE username = %s OR email = %s", 
                  (data['username'], data['email']))
        existing_user = db.fetchone()
        
        if existing_user:
            return jsonify({"error": "Username or email already exists"}), 409
        
        # Create new user
        password_hash = hash_password(data['password'])
        db.execute("""
            INSERT INTO users (username, email, password_hash) 
            VALUES (%s, %s, %s)
        """, (data['username'], data['email'], password_hash))
        db.commit()
        
        # Get the newly created user ID
        db.execute("SELECT LAST_INSERT_ID() as id")
        user_id = db.fetchone()['id']
        
        # Create tokens
        access_token = create_access_token(identity=user_id)
        refresh_token = create_refresh_token(identity=user_id)
        
        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ("username", "password")):
        return jsonify({"error": "Missing required fields"}), 400
    
    with Database() as db:
        db.execute("SELECT id, password_hash FROM users WHERE username = %s", 
                  (data['username'],))
        user = db.fetchone()
        
        if not user or not check_password(data['password'], user['password_hash']):
            return jsonify({"error": "Invalid credentials"}), 401
        
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        return jsonify({
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify({"access_token": access_token}), 200
