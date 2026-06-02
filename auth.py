from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from database import conn, cursor

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = generate_password_hash(data["password"])
    print("REGISTER:", name, email)

    try:

        cursor.execute(
            """
            INSERT INTO users(name, email, password)
            VALUES (%s, %s, %s)
            """,
            (name, email, password)
        )

        conn.commit()
        print("USER INSERTED")

        return jsonify({
            "message": "User Registered Successfully"
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "error": str(e)
        }), 400

@auth.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    cursor.execute(
    """
    SELECT id, name, email, password
    FROM users
    WHERE email = %s
    """,
    (email,)
)

    user = cursor.fetchone()

    if user and check_password_hash(user[3], password):

      return jsonify({
        "message": "Login Successful",
        "user_id": user[0],
        "name": user[1],
        "email": user[2]
    })

    return jsonify({
    "error": "Invalid Email or Password"
}), 401