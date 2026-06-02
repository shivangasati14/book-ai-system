import { useState, useEffect } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      window.location.href = "/";
    }
  }, []);

  const handleRegister = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/register", {
        name,
        email,
        password,
      });

      setMessage("✅ Registration Successful");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      setMessage("❌ Registration Failed");
      console.log(error);
    }
  };

  return (
    <div className="hero">
      <h1>📝 Register</h1>

      <p>Create a new account</p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <br />

      <div className="search-container">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRegister();
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
              handleRegister();
            }
          }}
        />
      </div>

      <br />

      <button onClick={handleRegister}>Register</button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
