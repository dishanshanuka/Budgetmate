from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)


USER_DATA = {
    "email": "johndoe@work.com",
    "password": "password123"
}

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Basic authentication logic
    if email == USER_DATA['email'] and password == USER_DATA['password']:
        return jsonify({"message": "Login successful", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "error"}), 401


@app.route('/test-db', methods=['GET'])
def test_db():
    conn = get_db_connection()
    if conn:
        version = conn.version
        conn.close()
        return jsonify({"message": "Connected to Oracle Cloud successfully!", "oracle_version": version, "status": "success"}), 200
    else:
        return jsonify({"message": "Failed to connect", "status": "error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)