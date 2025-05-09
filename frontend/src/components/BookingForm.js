import React, { useState, useEffect } from 'react';
import { createBooking, updateBooking } from '../services/bookingService';
import { syncBookingToGoogle, getGoogleStatus } from '../services/googleCalendarService';
import moment from 'moment';

const BookingForm = ({ 
  selectedSlot, 
  onClose, 
  onBookingCreated, 
  existingBooking = null 
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('pending');
  const [syncToGoogle, setSyncToGoogle] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingBooking) {
      setTitle(existingBooking.title || '');
      setNotes(existingBooking.notes || '');
      setStatus(existingBooking.status || 'pending');
    }
    
    // Check Google Calendar connection status
    checkGoogleStatus();
  }, [existingBooking]);

  const checkGoogleStatus = async () => {
    try {
      const data = await getGoogleStatus();
      setGoogleConnected(data.connected);
    } catch (error) {
      console.error('Failed to check Google status', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      let bookingId;
      
      if (existingBooking) {
        // Update existing booking
        const updatedBooking = await updateBooking(existingBooking._id, {
          title,
          notes,
          status,
          start: existingBooking.start,
          end: existingBooking.end
        });
        bookingId = updatedBooking._id;
      } else {
        // Create new booking
        const newBooking = await createBooking({
          title,
          notes,
          start: selectedSlot.start,
          end: selectedSlot.end
        });
        bookingId = newBooking._id;
      }
      
      // Sync to Google Calendar if selected
      if (syncToGoogle && googleConnected) {
        try {
          await syncBookingToGoogle(bookingId);
        } catch (googleError) {
          console.error('Failed to sync with Google Calendar', googleError);
          // Continue without failing the whole operation
        }
      }
      
      onBookingCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        {existingBooking ? 'Edit Booking' : 'New Booking'}
      </h2>
      
      {selectedSlot && !existingBooking && (
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          <p>
            <span className="font-medium">Start:</span> {moment(selectedSlot.start).format('MMM D, YYYY h:mm A')}
          </p>
          <p>
            <span className="font-medium">End:</span> {moment(selectedSlot.end).format('MMM D, YYYY h:mm A')}
          </p>
        </div>
      )}
      
      {existingBooking && (
        <div className="mb-4 text-gray-600 dark:text-gray-300">
          <p>
            <span className="font-medium">Start:</span> {moment(existingBooking.start).format('MMM D, YYYY h:mm A')}
          </p>
          <p>
            <span className="font-medium">End:</span> {moment(existingBooking.end).format('MMM D, YYYY h:mm A')}
          </p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Booking title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="notes">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Add any notes here"
            rows="3"
          />
        </div>
        
        {existingBooking && (
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-1" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        )}
        
        {googleConnected && (
          <div className="mb-4">
            <label className="flex items-center text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={syncToGoogle}
                onChange={(e) => setSyncToGoogle(e.target.checked)}
                className="mr-2"
              />
              Sync with Google Calendar
            </label>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;