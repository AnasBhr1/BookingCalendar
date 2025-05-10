import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DarkModeToggle from './DarkModeToggle';
import { Menu, X, Calendar, BookOpen, User, Settings, LogOut, BarChart2, Users, Clock } from 'lucide-react';

const Navigation = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Function to check if a route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">BookingApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link 
                  to="/calendar" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/calendar') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </div>
                </Link>
                
                <Link 
                  to="/bookings" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/bookings') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>My Bookings</span>
                  </div>
                </Link>
                
                <Link 
                  to="/profile" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/profile') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </div>
                </Link>
                
                {isAdmin() && (
                  <div className="relative">
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                        location.pathname.includes('/admin')
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <BarChart2 className="h-4 w-4" />
                      <span>Admin</span>
                      <svg className={`h-4 w-4 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Admin Dropdown Menu */}
                    {adminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                        <Link 
                          to="/admin/dashboard" 
                          className={`block px-4 py-2 text-sm ${
                            isActive('/admin/dashboard')
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          to="/admin/bookings" 
                          className={`block px-4 py-2 text-sm ${
                            isActive('/admin/bookings')
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                        >
                          All Bookings
                        </Link>
                        <Link 
                          to="/admin/availability" 
                          className={`block px-4 py-2 text-sm ${
                            isActive('/admin/availability')
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                        >
                          Manage Availability
                        </Link>
                        <Link 
                          to="/admin/users" 
                          className={`block px-4 py-2 text-sm ${
                            isActive('/admin/users')
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                          }`}
                        >
                          Manage Users
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-1">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </button>
                
                <div className="flex items-center pl-3 border-l border-gray-300 dark:border-gray-700">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentUser.name}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/login') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
            
            <DarkModeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <DarkModeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium text-lg">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentUser.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser.email}
                    </span>
                  </div>
                </div>
                
                <Link 
                  to="/calendar" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/calendar') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Calendar</span>
                  </div>
                </Link>
                
                <Link 
                  to="/bookings" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/bookings') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>My Bookings</span>
                  </div>
                </Link>
                
                <Link 
                  to="/profile" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/profile') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </div>
                </Link>
                
                {isAdmin() && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-4">
                      Admin
                    </div>
                    
                    <Link 
                      to="/admin/dashboard" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/admin/dashboard') 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <BarChart2 className="h-5 w-5" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/admin/bookings" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/admin/bookings') 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>All Bookings</span>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/admin/availability" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/admin/availability') 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>Manage Availability</span>
                      </div>
                    </Link>
                    
                    <Link 
                      to="/admin/users" 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive('/admin/users') 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Manage Users</span>
                      </div>
                    </Link>
                  </>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 mt-4"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/login') 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 mt-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;