import { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      window.location.href = "/";
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data));

      setMessage("✅ Login Successful");
      window.location.href = "/";
    } catch (error) {
      setMessage("❌ Invalid Email or Password");

      console.log(error);
    }
  };

  return (
    <div className="hero">
      <h1>🔐 Login</h1>

      <p>Login to save your favorite books</p>

      <div className="search-container">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </div>

      <br />

      <div className="search-container">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
      </div>

      <br />

      <button onClick={handleLogin}>Login</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
