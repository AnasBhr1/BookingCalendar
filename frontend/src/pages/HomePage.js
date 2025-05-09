import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { currentUser, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-4">
            Welcome to the Booking Calendar App
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A powerful application for managing appointments and scheduling with ease.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {currentUser ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">
                Hello, {currentUser.name}!
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link 
                  to="/calendar" 
                  className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition duration-200"
                >
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                    View Calendar
                  </h3>
                  <p className="text-gray-600">
                    See your schedule and available time slots, and make new bookings.
                  </p>
                </Link>
                
                <Link 
                  to="/bookings" 
                  className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition duration-200"
                >
                  <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                    My Bookings
                  </h3>
                  <p className="text-gray-600">
                    View and manage your existing bookings.
                  </p>
                </Link>
                
                {isAdmin() && (
                  <>
                    <Link 
                      to="/admin/bookings" 
                      className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition duration-200"
                    >
                      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                        All Bookings
                      </h3>
                      <p className="text-gray-600">
                        View and manage all user bookings.
                      </p>
                    </Link>
                    
                    <Link 
                      to="/admin/availability" 
                      className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition duration-200"
                    >
                      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                        Manage Availability
                      </h3>
                      <p className="text-gray-600">
                        Set up and manage available time slots.
                      </p>
                    </Link>
                    
                    <Link 
                      to="/admin/users" 
                      className="bg-indigo-50 p-6 rounded-lg hover:bg-indigo-100 transition duration-200"
                    >
                      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                        Manage Users
                      </h3>
                      <p className="text-gray-600">
                        View and manage user accounts.
                      </p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-6">
                Get Started with Booking Calendar
              </h2>
              
              <p className="text-gray-600 mb-8">
                Please login or create an account to start managing your bookings.
              </p>
              
              <div className="flex justify-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-200"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                Interactive Calendar
              </h3>
              <p className="text-gray-600">
                View and interact with a fully-featured calendar interface.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                Booking Management
              </h3>
              <p className="text-gray-600">
                Create, reschedule, and cancel appointments with ease.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                User Authentication
              </h3>
              <p className="text-gray-600">
                Secure login and registration with role-based access control.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                Real-Time Updates
              </h3>
              <p className="text-gray-600">
                See availability updates in real-time as bookings are made.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                Admin Dashboard
              </h3>
              <p className="text-gray-600">
                Powerful admin tools to manage users, bookings, and availability.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-indigo-700 mb-3">
                Responsive Design
              </h3>
              <p className="text-gray-600">
                Works seamlessly on desktop, tablet, and mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;