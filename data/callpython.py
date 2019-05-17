from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/callpython', methods=['POST'])
def callpython():
    return 'egwgqgqe'

if __name__ == "__main__":
    app.run(debug=True)