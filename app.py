from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection

import pickle
import numpy as np
from auth import auth

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth)

# LOAD FILES

pt = pickle.load(open("pt.pkl", "rb"))
books = pickle.load(open("books.pkl", "rb"))
similarity_scores = pickle.load(open("similarity.pkl", "rb"))
popular_df = pickle.load(open("popular.pkl", "rb"))


@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.json
    book_name = data["book"]

    # Book not found check
    if book_name not in pt.index:
        return jsonify({
            "error": "Book not found"
        }), 404

    index = np.where(pt.index == book_name)[0][0]

    similar_items = sorted(
        list(enumerate(similarity_scores[index])),
        key=lambda x: x[1],
        reverse=True
    )[1:6]

    recommendations = []

    for i in similar_items:

        temp_df = books[books["Book-Title"] == pt.index[i[0]]]

        book_info = temp_df.drop_duplicates("Book-Title")

        recommendations.append({
            "title": book_info["Book-Title"].values[0],
            "author": book_info["Book-Author"].values[0],
            "image": book_info["Image-URL-L"].values[0]
        })

    return jsonify(recommendations)

@app.route("/trending", methods=["GET"])
def trending():

    trending_books = []

    top_books = popular_df.sort_values(
        "num_ratings",
        ascending=False
    ).head(10)

    for _, book in top_books.iterrows():

        trending_books.append({
            "title": book["Book-Title"],
            "author": book["Book-Author"],
            "image": book["Image-URL-L"]
        })

    return jsonify(trending_books)    

@app.route("/search", methods=["GET"])
def search():

     query = request.args.get("q", "")

     if query == "":
        return jsonify([])
 
     starts_with = [
     title
     for title in pt.index
     if title.lower().startswith(query.lower())
]

     contains = [
     title
     for title in pt.index
     if query.lower() in title.lower()
     and not title.lower().startswith(query.lower())
]

     matches = (starts_with + contains)[:5]

     return jsonify(matches)


@app.route("/")
def home():
    return "Book Recommendation API Running Successfully 🚀"

@app.route("/add-favorite", methods=["POST"])
def add_favorite():

    data = request.json

    user_id = data["user_id"]
    title = data["title"]
    author = data["author"]
    image = data["image"]

    cursor.execute(
    """
    SELECT * FROM favorites
    WHERE user_id=%s AND title=%s
    """,
    (user_id, title)
)

    existing = cursor.fetchone()

    if existing:
        return jsonify({
        "message": "Already in favorites"
        })

    cursor.execute(
        """
        INSERT INTO favorites
        (user_id, title, author, image)
        VALUES (%s, %s, %s, %s)
        """,
        (user_id, title, author, image)
    )

    conn.commit()

    return jsonify({
        "message": "Favorite Added"
    })

@app.route("/remove-favorite", methods=["POST"])
def remove_favorite():

    data = request.json

    user_id = data["user_id"]
    title = data["title"]

    cursor.execute(
        """
        DELETE FROM favorites
        WHERE user_id=%s AND title=%s
        """,
        (user_id, title)
    )

    conn.commit()

    return jsonify({
        "message": "Favorite Removed"
    })    


@app.route("/favorites/<int:user_id>")
def get_favorites(user_id):

    cursor.execute(
        """
        SELECT title, author, image
        FROM favorites
        WHERE user_id=%s
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    books = []

    for row in rows:
        books.append({
            "title": row[0],
            "author": row[1],
            "image": row[2]
        })

    return jsonify(books)

if __name__ == "__main__":
    app.run(debug=True)