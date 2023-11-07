import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./loginScreen.css";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

      // Kontrollera användarens roller och navigera baserat på rollen
      if (user.roles.includes("ROLE_ADMIN")) {
        navigate("/AdminHome"); // Användaren är en admin
      } else {
        navigate("/UserHome"); // Användaren är en vanlig användare
      }
    } catch (error) {
      console.error("Inloggning misslyckades:", error);
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
    </div>
  );
};

export default LoginScreen;
