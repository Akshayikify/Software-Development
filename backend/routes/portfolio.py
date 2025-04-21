from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models import Database
from datetime import datetime

portfolio_bp = Blueprint('portfolio', __name__)

@portfolio_bp.route('/portfolio', methods=['GET'])
@jwt_required()
def get_portfolio():
    user_id = get_jwt_identity()
    
    with Database() as db:
        db.execute("""
            SELECT * FROM portfolio 
            WHERE user_id = %s 
            ORDER BY purchase_date DESC
        """, (user_id,))
        portfolio_items = db.fetchall()
        
        return jsonify(portfolio_items), 200

@portfolio_bp.route('/portfolio', methods=['POST'])
@jwt_required()
def add_to_portfolio():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ["coin_id", "amount", "purchase_price", "purchase_date"]
    if not all(k in data for k in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        with Database() as db:
            db.execute("""
                INSERT INTO portfolio 
                (user_id, coin_id, amount, purchase_price, purchase_date, notes) 
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                user_id, 
                data['coin_id'], 
                data['amount'], 
                data['purchase_price'],
                data['purchase_date'],
                data.get('notes', '')
            ))
            db.commit()
            
            return jsonify({"message": "Item added to portfolio"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@portfolio_bp.route('/portfolio/<int:portfolio_id>', methods=['PUT'])
@jwt_required()
def update_portfolio_item(portfolio_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    with Database() as db:
        # Verify ownership
        db.execute("SELECT id FROM portfolio WHERE id = %s AND user_id = %s", 
                  (portfolio_id, user_id))
        if not db.fetchone():
            return jsonify({"error": "Item not found or unauthorized"}), 404
        
        # Update item
        update_fields = []
        params = []
        
        if 'amount' in data:
            update_fields.append("amount = %s")
            params.append(data['amount'])
        if 'purchase_price' in data:
            update_fields.append("purchase_price = %s")
            params.append(data['purchase_price'])
        if 'purchase_date' in data:
            update_fields.append("purchase_date = %s")
            params.append(data['purchase_date'])
        if 'notes' in data:
            update_fields.append("notes = %s")
            params.append(data['notes'])
        
        if update_fields:
            params.extend([portfolio_id, user_id])
            query = f"""
                UPDATE portfolio 
                SET {', '.join(update_fields)}
                WHERE id = %s AND user_id = %s
            """
            db.execute(query, params)
            db.commit()
        
        return jsonify({"message": "Portfolio item updated"}), 200

@portfolio_bp.route('/portfolio/<int:portfolio_id>', methods=['DELETE'])
@jwt_required()
def delete_portfolio_item(portfolio_id):
    user_id = get_jwt_identity()
    
    with Database() as db:
        db.execute("DELETE FROM portfolio WHERE id = %s AND user_id = %s", 
                  (portfolio_id, user_id))
        db.commit()
        
        if db.cursor.rowcount == 0:
            return jsonify({"error": "Item not found or unauthorized"}), 404
        
        return jsonify({"message": "Portfolio item deleted"}), 200