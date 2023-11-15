import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./loginScreen.css";
import { useAuth } from "../authContext";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/signin",
        {
          username,
          password,
        }
      );

      const user = response.data;
      localStorage.setItem("accessToken", user.accessToken);
      localStorage.setItem("loggedInUserId", user.id);

      login(user);

      if (user.roles.includes("ROLE_ADMIN")) {
        navigate("/AdminHome");
      } else {
        navigate("/UserHome");
      }
    } catch (error) {
      console.error("Inloggning misslyckades:", error.response.data.message);
      setError("Fel användarnamn eller lösenord. Försök igen.");
    }
  };


  return (
    <div className="container">
      <h1>Logga in</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Logga in</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LoginScreen;