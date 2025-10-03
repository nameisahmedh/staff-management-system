import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { loggedInUser } = useAuth();

  // If not logged in, redirect to login
  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  // If admin role required but user is not admin
  if (requireAdmin && loggedInUser.role !== 'admin') {
    return <Navigate to="/staff" replace />;
  }

  // If user is admin but accessing staff routes
  if (loggedInUser.role === 'admin' && !requireAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;

