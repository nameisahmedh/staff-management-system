import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { loggedInUser } = useAuth();

  // Redirect based on user role
  if (loggedInUser?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/staff" replace />;
  }
};

export default Dashboard;

