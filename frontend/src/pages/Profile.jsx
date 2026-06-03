import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `https://book-ai-system.onrender.com/favorites/${user.user_id}`,
        );

        setFavoritesCount(response.data.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <Navbar favoritesCount={favoritesCount} />

      <div className="profile-container">
        <div className="profile-card">
          <h1>👤 My Profile</h1>

          <div className="profile-info">
            <p>
              🧑 <strong>Name:</strong> {user?.name}
            </p>

            <p>
              📧 <strong>Email:</strong> {user?.email}
            </p>

            <p>
              ❤️ <strong>Total Favorites:</strong> {favoritesCount}
            </p>
          </div>

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
