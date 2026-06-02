import pandas as pd
import pickle

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

# FINAL BOOK DATA

final_books = final_ratings.drop_duplicates("Book-Title")

# POPULAR DATAFRAME

popular_df = final_ratings.groupby("Book-Title")["Book-Rating"].agg(
    ["count", "mean"]
).reset_index()

popular_df.columns = [
    "Book-Title",
    "num_ratings",
    "avg_rating"
]

popular_df = popular_df.merge(
    books,
    on="Book-Title"
)

popular_df = popular_df.drop_duplicates("Book-Title")

# SAVE FILES

pickle.dump(pt, open("pt.pkl", "wb"))

pickle.dump(similarity_scores, open("similarity.pkl", "wb"))

pickle.dump(final_books, open("books.pkl", "wb"))

pickle.dump(popular_df, open("popular.pkl", "wb"))

print("MODEL SAVED SUCCESSFULLY")