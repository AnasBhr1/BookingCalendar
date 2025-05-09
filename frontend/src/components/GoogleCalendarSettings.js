import React, { useState, useEffect } from 'react';
import { 
  getGoogleAuthUrl, 
  disconnectGoogleCalendar, 
  getGoogleStatus 
} from '../services/googleCalendarService';

const GoogleCalendarSettings = () => {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoogleStatus();
  }, []);

  const fetchGoogleStatus = async () => {
    try {
      setLoading(true);
      const data = await getGoogleStatus();
      setConnected(data.connected);
      setEmail(data.email);
      setError('');
    } catch (err) {
      setError('Failed to get Google Calendar status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { url } = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (err) {
      setError('Failed to get Google authorization URL');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await disconnectGoogleCalendar();
      setConnected(false);
      setError('');
    } catch (err) {
      setError('Failed to disconnect Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Google Calendar Integration</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {connected ? (
        <div>
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Connected to Google Calendar ({email})</span>
          </div>
          
          <p className="mb-4 text-gray-600">
            Your bookings will automatically sync with your Google Calendar.
          </p>
          
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={loading}
          >
            Disconnect from Google Calendar
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-600">
            Connect your Google Calendar to automatically sync your bookings.
          </p>
          
          <button
            onClick={handleConnect}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Connect with Google
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarSettings;