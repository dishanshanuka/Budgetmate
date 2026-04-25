from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # React ekata backend ekath ekka connect wenna meka aniwarshayi

@app.route('/api/data')
def get_data():
    return jsonify({"message": "Hello from Python Backend!"})

if __name__ == '__main__':
    app.run(debug=True)