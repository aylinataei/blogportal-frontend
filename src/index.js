import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Använd Routes istället för Switch
import AdminHomeScreen from './screens/adminHomeScreen';
import LoginScreen from './screens/loginScreen';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path='/AdminHome' element={<AdminHomeScreen />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();

