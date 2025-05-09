import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import GoogleCalendarSettings from '../components/GoogleCalendarSettings';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Profile update logic would go here
    setSuccess('Profile updated successfully');
    
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your email"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
        
        <GoogleCalendarSettings />
      </div>
    </div>
  );
};

export default ProfilePage;