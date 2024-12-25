// components/PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || localStorage.getItem('token');
    
    if (!token) {
      setSessionExpired(true);
    }
  }, []);

  // Show message and redirect to login if no token
  if (sessionExpired) {
    alert("Session expired, please re-login");
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default PrivateRoute;
