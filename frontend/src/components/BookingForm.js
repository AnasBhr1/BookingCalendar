import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { createBooking, updateBooking } from '../services/bookingService';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import moment from 'moment';

const BookingForm = ({ selectedSlot, booking, onClose, onBookingCreated }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    start: '',
    end: '',
    notes: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // If editing an existing booking
    if (booking) {
      setFormData({
        title: booking.title || '',
        start: moment(booking.start).format('YYYY-MM-DDTHH:mm'),
        end: moment(booking.end).format('YYYY-MM-DDTHH:mm'),
        notes: booking.notes || '',
        status: booking.status || 'pending'
      });
    } 
    // If creating a new booking from selected slot
    else if (selectedSlot) {
      setFormData({
        title: '',
        start: moment(selectedSlot.start).format('YYYY-MM-DDTHH:mm'),
        end: moment(selectedSlot.end).format('YYYY-MM-DDTHH:mm'),
        notes: '',
        status: 'pending'
      });
    }
  }, [booking, selectedSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.start) {
      newErrors.start = 'Start time is required';
    }
    
    if (!formData.end) {
      newErrors.end = 'End time is required';
    }
    
    // Check if end time is after start time
    if (formData.start && formData.end && moment(formData.end).isSameOrBefore(moment(formData.start))) {
      newErrors.end = 'End time must be after start time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const bookingData = {
        title: formData.title,
        start: new Date(formData.start),
        end: new Date(formData.end),
        notes: formData.notes,
        status: formData.status,
        user: currentUser.id
      };
      
      if (booking) {
        // Update existing booking
        await updateBooking(booking._id, bookingData);
      } else {
        // Create new booking
        await createBooking(bookingData);
      }
      
      onBookingCreated();
      onClose();
    } catch (err) {
      setError('Failed to save booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return moment(date).format('dddd, MMMM D, YYYY');
  };

  const formatTime = (date) => {
    return moment(date).format('h:mm A');
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Booking Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Meeting with Team"
            className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Time
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${errors.start ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
            </div>
            {errors.start && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.start}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="end" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Time
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                id="end"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${errors.end ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
            </div>
            {errors.end && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.end}</p>
            )}
          </div>
        </div>
        
        {formData.start && formData.end && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(formData.start)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>{formatTime(formData.start)} - {formatTime(formData.end)}</span>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional information about this booking..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
        </div>
        
        {currentUser && currentUser.role === 'admin' && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>Save Booking</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;