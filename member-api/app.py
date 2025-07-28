from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3, hashlib, jwt, datetime

app = Flask(__name__)
CORS(app)
SECRET_KEY = "your_jwt_secret"  # 實務請設環境變數

DB_FILE = 'users.db'

def hash_password(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

def get_user(username):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT id, username, password, nickname FROM users WHERE username = ?", (username,))
    user = c.fetchone()
    conn.close()
    return user

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    nickname = data.get("nickname")
    if not username or not password:
        return jsonify({"error": "帳號密碼必填"}), 400
    if get_user(username):
        return jsonify({"error": "帳號已存在"}), 400
    pw_hash = hash_password(password)
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("INSERT INTO users (username, password, nickname) VALUES (?, ?, ?)", (username, pw_hash, nickname))
    conn.commit()
    conn.close()
    return jsonify({"msg": "註冊成功"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = get_user(username)
    if not user or hash_password(password) != user[2]:
        return jsonify({"error": "帳號或密碼錯誤"}), 401
    token = jwt.encode(
        {
            "user_id": user[0],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        SECRET_KEY,
        algorithm="HS256"
    )
    return jsonify({"token": token, "nickname": user[3]})

# 更多會員資料 CRUD、token 驗證可再加

if __name__ == "__main__":
    app.run(debug=True)
