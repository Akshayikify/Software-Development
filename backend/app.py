from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from routes.portfolio import portfolio_bp
from routes.watchlist import watchlist_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app)

# Setup JWT
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(portfolio_bp, url_prefix='/api')
app.register_blueprint(watchlist_bp, url_prefix='/api')

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized access"}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({"error": "Forbidden"}), 403

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
