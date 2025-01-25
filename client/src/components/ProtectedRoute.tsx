import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const isAuthenticated = (): boolean => {
    const jwt = localStorage.getItem('baseball-sim-jwt');
    return !!jwt;
  };

  return isAuthenticated() ? <Outlet /> : <Navigate to='/login' />;
};
