from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models import Database

watchlist_bp = Blueprint('watchlist', __name__)

@watchlist_bp.route('/watchlist', methods=['GET'])
@jwt_required()
def get_watchlist():
    user_id = get_jwt_identity()
    
    with Database() as db:
        db.execute("""
            SELECT coin_id FROM watchlist 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (user_id,))
        watchlist_items = db.fetchall()
        
        coin_ids = [item['coin_id'] for item in watchlist_items]
        return jsonify({"coins": coin_ids}), 200

@watchlist_bp.route('/watchlist/<coin_id>', methods=['POST'])
@jwt_required()
def add_to_watchlist(coin_id):
    user_id = get_jwt_identity()
    
    try:
        with Database() as db:
            db.execute("""
                INSERT INTO watchlist (user_id, coin_id) 
                VALUES (%s, %s)
            """, (user_id, coin_id))
            db.commit()
            
            return jsonify({"message": "Coin added to watchlist"}), 201
    except Exception as e:
        if "Duplicate entry" in str(e):
            return jsonify({"error": "Coin already in watchlist"}), 409
        return jsonify({"error": str(e)}), 400

@watchlist_bp.route('/watchlist/<coin_id>', methods=['DELETE'])
@jwt_required()
def remove_from_watchlist(coin_id):
    user_id = get_jwt_identity()
    
    with Database() as db:
        db.execute("""
            DELETE FROM watchlist 
            WHERE user_id = %s AND coin_id = %s
        """, (user_id, coin_id))
        db.commit()
        
        if db.cursor.rowcount == 0:
            return jsonify({"error": "Coin not found in watchlist"}), 404
        
        return jsonify({"message": "Coin removed from watchlist"}), 200