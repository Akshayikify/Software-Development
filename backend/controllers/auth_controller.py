from flask import request, jsonify
from database import get_db_connection
from ..database.db import get_db_connection  # Relative import
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
import bcrypt
from database import get_db_connection

def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Check if user already exists
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            cursor.close()
            conn.close()
            return jsonify({'message': 'Username already exists'}), 400
        
        # Hash password
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Create user
        cursor.execute(
            'INSERT INTO users (username, password) VALUES (%s, %s)',
            (username, hashed_password.decode('utf-8'))
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'User registered successfully'}), 201
    
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Find user
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Create token
        access_token = create_access_token(identity={'id': user['id'], 'username': user['username']})
        
        response = jsonify({
            'message': 'Logged in successfully',
            'user': {'id': user['id'], 'username': user['username']}
        })
        
        set_access_cookies(response, access_token)
        return response, 200
    
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

def logout():
    response = jsonify({'message': 'Logged out successfully'})
    unset_jwt_cookies(response)
    return response, 200

def check_auth(current_user):
    return jsonify({'user': current_user}), 200
