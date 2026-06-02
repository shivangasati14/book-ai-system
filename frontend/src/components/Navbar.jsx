import { Link } from "react-router-dom";

function Navbar({ favoritesCount }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar">
      <h2>Book<span>AI</span></h2>

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/favorites">Favorites ({favoritesCount})</Link>
        </li>

        {user ? (
          <>
            <li
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              Logout
            </li>

            <li>
              <Link to="/profile" className="profile-link">
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>

            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
