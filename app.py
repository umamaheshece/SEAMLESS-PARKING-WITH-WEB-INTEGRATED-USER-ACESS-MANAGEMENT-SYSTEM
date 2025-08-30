import mysql.connector
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# Store last scanned RFID and status
last_rfid = {"rfid_tag": "None", "access_status": "Waiting..."}

def connect_to_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="123456",
        database="PARK"
    )

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_rfid', methods=['POST'])
def update_rfid():
    global last_rfid

    rfid_tag = request.form.get('rfid_tag')
    if rfid_tag:
        try:
            conn = connect_to_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM rfid_tags WHERE rfid_tag = %s", (rfid_tag,))
            result = cursor.fetchone()
            conn.close()

            if result:
                last_rfid = {"rfid_tag": rfid_tag, "access_status": "✅ Access Granted"}
                return jsonify({"message": "Access granted", "rfid_tag": rfid_tag}), 200
            else:
                last_rfid = {"rfid_tag": rfid_tag, "access_status": "❌ Access Denied"}
                return jsonify({"message": "Access denied, RFID tag not registered"}), 403

        except mysql.connector.Error as err:
            return jsonify({"error": f"Database error: {err}"}), 500
    else:
        return jsonify({"error": "No RFID tag received"}), 400
@app.route('/rfid_data')
def rfid_data():
    return jsonify(last_rfid)  # Sends the last scanned RFID tag
  # Send the last scanned RFID data

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
