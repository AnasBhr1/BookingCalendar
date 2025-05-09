import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DarkModeToggle from './DarkModeToggle';

const Navigation = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 dark:bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">Booking Calendar</Link>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/calendar" className="hover:text-indigo-200 dark:hover:text-gray-300">Calendar</Link>
                <Link to="/bookings" className="hover:text-indigo-200 dark:hover:text-gray-300">My Bookings</Link>
                <Link to="/profile" className="hover:text-indigo-200 dark:hover:text-gray-300">Profile</Link>
                
                {isAdmin() && (
                  <>
                    <Link to="/admin/dashboard" className="hover:text-indigo-200 dark:hover:text-gray-300">Dashboard</Link>
                    <Link to="/admin/bookings" className="hover:text-indigo-200 dark:hover:text-gray-300">All Bookings</Link>
                    <Link to="/admin/availability" className="hover:text-indigo-200 dark:hover:text-gray-300">Manage Availability</Link>
                    <Link to="/admin/users" className="hover:text-indigo-200 dark:hover:text-gray-300">Manage Users</Link>
                  </>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="hover:text-indigo-200 dark:hover:text-gray-300"
                >
                  Logout
                </button>
                
                <span className="text-indigo-200 dark:text-gray-400">
                  Hello, {currentUser.name}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200 dark:hover:text-gray-300">Login</Link>
                <Link to="/register" className="hover:text-indigo-200 dark:hover:text-gray-300">Register</Link>
              </>
            )}
            
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;