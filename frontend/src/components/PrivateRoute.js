import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;