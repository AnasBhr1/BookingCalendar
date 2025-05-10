import React from 'react';
import Navigation from '../Navigation';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const DashboardLayout = ({ children, requiresAdmin = false }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Redirect to regular dashboard if requires admin but user is not admin
  if (requiresAdmin && !isAdmin()) {
    return <Navigate to="/calendar" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="pt-6 pb-12">
        {children}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Booking Calendar App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;