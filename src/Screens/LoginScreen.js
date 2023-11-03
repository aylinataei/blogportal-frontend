import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importera useNavigate

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Skapa en instans av useNavigate

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        username,
        password,
      });

      console.log(response.data); // Visa vad som returneras från backend

      // Om inloggningen lyckades, omdirigera användaren till AdminHomeScreen
      navigate('/AdminHome');
    } catch (error) {
      console.error('Inloggning misslyckades:', error);
    }
  };

  return (
    <div>
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
      <button onClick={handleLogin}>Logga in</button>
    </div>
  );
};

export default LoginScreen;
