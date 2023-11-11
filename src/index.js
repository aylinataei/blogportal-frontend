// index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminHomeScreen from './screens/AdminHomeScreen';
import LoginScreen from './screens/LoginScreen';
import App from './App';
import reportWebVitals from './reportWebVitals';
import PasswordResetPage from './screens/passwordResetPage';
import UserHomeScreen from './screens/userHomeScreen';
import ProtectedRoute from './screens/privateRoute';
import { AuthProvider } from './authContext';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route
            path="/AdminHome"
            element={<ProtectedRoute
              isAllowed={(user) => user && user.roles.includes('ROLE_ADMIN')}
            >
              <AdminHomeScreen />
            </ProtectedRoute>}
          >
          </Route>

          <Route
            path="/UserHome"
            element={<ProtectedRoute
              isAllowed={(user) => user && user.roles.includes('ROLE_USER')}
            >
              <UserHomeScreen />
            </ProtectedRoute>}

          >

          </Route>

          <Route path="/app" element={<App />} />
          <Route path="/set-password" element={<PasswordResetPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
);

reportWebVitals();
