// CheckTokenExpiration.js
import { useEffect } from 'react';
import { useAuth } from './authContext';

const CheckTokenExpiration = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const expirationTime = payload.exp * 1000;

          if (expirationTime <= new Date().getTime()) {
            // Access token har gått ut, logga ut användaren
            logout();
          }
        } catch (error) {
          console.error('Error decoding access token:', error);
        }
      }
    };

    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, [logout]);

  return null;
};

export default CheckTokenExpiration;
