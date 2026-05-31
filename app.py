from flask import Flask, request, jsonify, session
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "task_manager_secret"
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

def get_db_connection():
    return mysql.connector.connect(host="localhost", user="root", password="Kanna@2006", database="task_manager" )

@app.route("/")
def home():
    return jsonify({"message": "Backend is running successfully"})

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(""" INSERT INTO user (name, email, password) VALUES (%s, %s, %s) """, (name, email, password))
        conn.commit()
        return jsonify({"message": "User registered successfully"})
    except mysql.connector.IntegrityError:
        return jsonify({"message": "Email already exists"}), 409
    finally:
        cursor.close()
        conn.close()

@app.route('/login', methods=['POST'])
def signin():
    data = request.get_json()
    email = data['email']
    password = data['password']
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(""" SELECT * FROM user WHERE email=%s AND password=%s""", (email, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        session['user_id'] = user['id']
        session['name'] = user['name']
        return jsonify({
            "message": "Login successful",
            "user_id": user['id'],
            "name": user['name']
        })
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, name, email FROM user WHERE id=%s", (user_id,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify(user)
    return jsonify({"message": "User not found"}), 404
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

@app.route('/task', methods=['GET'])
def get_tasks():
    user_id = request.args.get('user_id')
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    if user_id:
        cursor.execute("SELECT * FROM task WHERE user_id=%s ORDER BY id DESC", (user_id,))
    else:
        cursor.execute("SELECT * FROM task ORDER BY id DESC")
    task = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(task)

@app.route('/task', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data['title']
    description = data.get('description', '')
    stage = data.get('stage', 'Todo')
    user_id = data.get('user_id')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""INSERT INTO task (title, description, stage, user_id) VALUES (%s, %s, %s, %s)""", (title, description, stage, user_id))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return jsonify({"message": "Task created", "id": new_id}), 201

@app.route('/task/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    title = data['title']
    description = data.get('description', '')
    stage = data.get('stage', 'Todo')
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""UPDATE task SET title=%s, description=%s, stage=%s WHERE id=%s""", (title, description, stage, task_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Task updated"})

@app.route('/task/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM task WHERE id=%s", (task_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Task deleted"})

if __name__ == "__main__":
    app.run(debug=True)
