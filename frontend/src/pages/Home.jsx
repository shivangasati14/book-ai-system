import "../App.css";

import Navbar from "../components/Navbar";

import { useState, useEffect } from "react";

import axios from "axios";

function Home() {
  const [bookName, setBookName] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await axios.get("https://book-ai-system.onrender.com/trending");

        setTrendingBooks(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrendingBooks();
  }, []);
  useEffect(() => {
  const fetchFavorites = async () => {
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {
      return;
    }

    try {
      const response = await axios.get(
        `https://book-ai-system.onrender.com/favorites/${user.user_id}`
      );

      setFavorites(response.data);
      console.log("Favorites:", response.data);

    } catch (error) {
      console.log(error);
    }
  };

  fetchFavorites();
}, []);

  const fetchSuggestions = async (value) => {
    setBookName(value);

    if (value.length < 2) {
      setSuggestions([]);

      return;
    }

    try {
      const response = await axios.get(
        `https://book-ai-system.onrender.com/search?q=${value}`,
      );

      setSuggestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post("https://book-ai-system.onrender.com/recommend", {
        book: bookName,
      });

      setRecommendations(response.data);
      setSuggestions([]);
      setError("");
      setLoading(false);
    } catch (error) {
      setRecommendations([]);

      setError("❌ Book not found. Please try another book.");
      setLoading(false);
      console.log(error);
    }
  };
  const addToFavorites = async (book) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    await axios.post(
      "https://book-ai-system.onrender.com/add-favorite",
      {
        user_id: user.user_id,
        title: book.title,
        author: book.author,
        image: book.image,
      }
    );

    const exists = favorites.find(
      (item) => item.title === book.title
    );

    if (!exists) {
      setFavorites([...favorites, book]);
    }

  } catch (error) {
    console.log(error);
  }
};
const removeFavorite = async (title) => {
  const user = JSON.parse(localStorage.getItem("user"));

  try {
    await axios.post(
      "https://book-ai-system.onrender.com/remove-favorite",
      {
        user_id: user.user_id,
        title: title,
      }
    );

    const updatedFavorites = favorites.filter(
      (book) => book.title !== title
    );

    setFavorites(updatedFavorites);

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div>
      <Navbar favoritesCount={favorites.length} />
      <div className="hero">
        <h1>📚 BookAI</h1>

        <p>Discover your next favorite book with AI-powered recommendations</p>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search books..."
            value={bookName}
            onChange={(e) => fetchSuggestions(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getRecommendations();
              }
            }}
          />

          <button onClick={getRecommendations} disabled={loading}>
            {loading ? "Searching..." : "Recommend"}
          </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-box">
            {suggestions.map((item, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setBookName(item);
                  setSuggestions([]);
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {recommendations.length > 0 && (
        <h2 className="results-title">📖 Recommended For You</h2>
      )}
      {favorites.length > 0 && (
        <div className="favorites-section">
          <h2>❤️ Your Favorite Books</h2>

          <div className="recommendations">
            {favorites.map((book, index) => (
              <div key={index} className="book-card">
                <button
                  className="remove-btn"
                  onClick={() => removeFavorite(book.title)}
                >
                  ❌
                </button>
                <img src={book.image} alt={book.title} className="book-image" />

                <h3>
                  {book.title.length > 50
                    ? book.title.substring(0, 50) + "..."
                    : book.title}
                </h3>

                <p>{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recommendations">
        {recommendations.map((book, index) => (
          <div key={index} className="book-card">
            <button
              className={`favorite-btn ${
                favorites.some((fav) => fav.title === book.title) ? "❤️" : "🤍"
              }`}
              onClick={() => addToFavorites(book)}
            >
              ❤️
            </button>

            <img src={book.image} alt={book.title} className="book-image" />

            <h3>
              {book.title.length > 50
                ? book.title.substring(0, 50) + "..."
                : book.title}
            </h3>

            <p>{book.author}</p>
          </div>
        ))}
      </div>
      {recommendations.length === 0 && (
        <div className="trending-section">
          <h2>🔥 Trending Books</h2>

          <div className="recommendations">
            {trendingBooks.map((book, index) => (
              <div key={index} className="book-card">
                <button
                  className="favorite-btn"
                  onClick={() => addToFavorites(book)}
                >
                  {favorites.some((fav) => fav.title === book.title)
                    ? "❤️"
                    : "🤍"}
                </button>

                <img src={book.image} alt={book.title} className="book-image" />
                <h3>
                  {book.title.length > 50
                    ? book.title.substring(0, 50) + "..."
                    : book.title}
                </h3>
                <p>{book.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
