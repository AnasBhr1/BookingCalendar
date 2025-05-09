import React, { useState, useEffect } from 'react';
import { createAvailabilitySlot, updateAvailabilitySlot } from '../services/availabilityService';
import moment from 'moment';

const AvailabilityForm = ({ 
  onClose, 
  onAvailabilityCreated, 
  existingSlot = null 
}) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingSlot) {
      setStart(moment(existingSlot.start).format('YYYY-MM-DDTHH:mm'));
      setEnd(moment(existingSlot.end).format('YYYY-MM-DDTHH:mm'));
      setRecurring(existingSlot.recurring || false);
      setDaysOfWeek(existingSlot.daysOfWeek || []);
    }
  }, [existingSlot]);

  const handleDayToggle = (day) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!start || !end) {
      setError('Start and end times are required');
      return;
    }
    
    if (recurring && daysOfWeek.length === 0) {
      setError('Please select at least one day of the week for recurring availability');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const slotData = {
        start,
        end,
        recurring,
        daysOfWeek: recurring ? daysOfWeek : []
      };
      
      if (existingSlot) {
        // Update existing slot
        await updateAvailabilitySlot(existingSlot._id, slotData);
      } else {
        // Create new slot
        await createAvailabilitySlot(slotData);
      }
      
      onAvailabilityCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold mb-4">
        {existingSlot ? 'Edit Availability' : 'New Availability'}
      </h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="start">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="end">
            End Time
          </label>
          <input
            type="datetime-local"
            id="end"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="mr-2"
            />
            Recurring availability
          </label>
        </div>
        
        {recurring && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Days of Week
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 0, label: 'Sun' },
                { value: 1, label: 'Mon' },
                { value: 2, label: 'Tue' },
                { value: 3, label: 'Wed' },
                { value: 4, label: 'Thu' },
                { value: 5, label: 'Fri' },
                { value: 6, label: 'Sat' }
              ].map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleDayToggle(day.value)}
                  className={`px-3 py-1 rounded ${
                    daysOfWeek.includes(day.value)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
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

export default AvailabilityForm;