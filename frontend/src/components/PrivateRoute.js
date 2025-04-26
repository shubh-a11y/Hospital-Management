import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../AuthContext';

const PrivateRoute = ({ adminOnly }) => {
  const { currentUser, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    // While checking authentication status, show a loading state
    return <div className="loading-container">Checking authentication...</div>;
  }
  
  if (!currentUser) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && currentUser.role !== 'admin') {
    // If admin-only route and user is not admin, redirect to home
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and passes role check, render the child route
  return <Outlet />;
};

export default PrivateRoute; 