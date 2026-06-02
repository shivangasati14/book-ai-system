import pandas as pd

from sklearn.metrics.pairwise import cosine_similarity

books = pd.read_csv("datasets/Books.csv", low_memory=False)
ratings = pd.read_csv("datasets/Ratings.csv", low_memory=False)

books.dropna(inplace=True)

merged_data = ratings.merge(books, on="ISBN")

# ACTIVE USERS

x = merged_data.groupby("User-ID").count()["Book-Rating"] > 200

active_users = x[x].index

filtered_rating = merged_data[
    merged_data["User-ID"].isin(active_users)
]

# POPULAR BOOKS

y = filtered_rating.groupby("Book-Title").count()["Book-Rating"] >= 50

famous_books = y[y].index

final_ratings = filtered_rating[
    filtered_rating["Book-Title"].isin(famous_books)
]

# PIVOT TABLE

pt = final_ratings.pivot_table(
    index="Book-Title",
    columns="User-ID",
    values="Book-Rating"
)

pt.fillna(0, inplace=True)

# SIMILARITY

similarity_scores = cosine_similarity(pt)

# RECOMMENDATION FUNCTION

def recommend(book_name):

    index = pt.index.get_loc(book_name)

    similarity_items = list(enumerate(similarity_scores[index]))

    sorted_items = sorted(
        similarity_items,
        key=lambda x: x[1],
        reverse=True
    )[1:6]

    for item in sorted_items:

        book_index = item[0]

        print(pt.index[book_index])

# TEST

recommend("1984")