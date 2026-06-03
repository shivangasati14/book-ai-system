import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      try {
        const response = await axios.get(
          `https://book-ai-system.onrender.com/favorites/${user.user_id}`
        );

        setFavorites(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (title) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post("https://book-ai-system.onrender.com/remove-favorite", {
        user_id: user.user_id,
        title: title,
      });

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

      <h1 className="results-title">❤️ My Favorites</h1>

      <div className="recommendations">
        {favorites.map((book, index) => (
          <div key={index} className="book-card">
            <button
              className="remove-btn"
              onClick={() => removeFavorite(book.title)}
            >
              ❌
            </button>

            <img
              src={book.image}
              alt={book.title}
              className="book-image"
            />

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
  );
}

export default Favorites;