from flask import request, jsonify
from database import get_db_connection

def get_watchlist(current_user):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT coin_id FROM watchlist WHERE user_id = %s', (current_user['id'],))
        watchlist = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return jsonify([item[0] for item in watchlist]), 200
    
    except Exception as e:
        print(f"Get watchlist error: {str(e)}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

def add_to_watchlist(current_user):
    try:
        data = request.get_json()
        coin_id = data.get('coinId')
        
        if not coin_id:
            return jsonify({'message': 'Coin ID is required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if already in watchlist
        cursor.execute(
            'SELECT id FROM watchlist WHERE user_id = %s AND coin_id = %s',
            (current_user['id'], coin_id)
        )
        existing = cursor.fetchone()
        
        if not existing:
            cursor.execute(
                'INSERT INTO watchlist (user_id, coin_id) VALUES (%s, %s)',
                (current_user['id'], coin_id)
            )
            conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Coin added to watchlist'}), 200
    
    except Exception as e:
        print(f"Add to watchlist error: {str(e)}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500

def remove_from_watchlist(current_user, coin_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            'DELETE FROM watchlist WHERE user_id = %s AND coin_id = %s',
            (current_user['id'], coin_id)
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'message': 'Coin removed from watchlist'}), 200
    
    except Exception as e:
        print(f"Remove from watchlist error: {str(e)}")
        return jsonify({'message': f'Server error: {str(e)}'}), 500