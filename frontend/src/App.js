import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { DarkModeProvider } from './context/DarkModeContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalendarPage from './pages/CalendarPage';
import UserBookingsPage from './pages/UserBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminAvailabilityPage from './pages/AdminAvailabilityPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <DarkModeProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
              <Navigation />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  <Route 
                    path="/calendar" 
                    element={
                      <PrivateRoute>
                        <CalendarPage />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/bookings" 
                    element={
                      <PrivateRoute>
                        <UserBookingsPage />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <PrivateRoute adminOnly={true}>
                        <AdminDashboardPage />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/bookings" 
                    element={
                      <PrivateRoute adminOnly={true}>
                        <AdminBookingsPage />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/availability" 
                    element={
                      <PrivateRoute adminOnly={true}>
                        <AdminAvailabilityPage />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin/users" 
                    element={
                      <PrivateRoute adminOnly={true}>
                        <AdminUsersPage />
                      </PrivateRoute>
                    } 
                  />
                  
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </Router>
        </DarkModeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;