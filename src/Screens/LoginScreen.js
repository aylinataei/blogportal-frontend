// loginScreen.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import './loginScreen.css';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        username,
        password,
      });

      const userData = response.data;
      localStorage.setItem('accessToken', userData.accessToken);
      login(userData);
      console.log(userData);

      if (userData.roles.includes('ROLE_ADMIN')) {
        navigate('/AdminHome');
      } else {
        navigate('/UserHome');
      }
    } catch (error) {
      console.error('Inloggning misslyckades:', error);
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
