from flask import Flask, request, jsonify
from flask_cors import CORS

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)