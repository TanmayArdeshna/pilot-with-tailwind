import React from 'react';
import { Outlet } from 'react-router-dom';
import 'assets/scss/auth-layout.scss'; 

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
