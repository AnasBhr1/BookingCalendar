import { useState, useEffect } from 'react';
import { getAvailabilitySlots } from '../services/availabilityService';

export const useAvailability = () => {
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        const data = await getAvailabilitySlots();
        
        // Format for FullCalendar
        const formattedSlots = data.map(slot => ({
          ...slot,
          title: 'Available',
          start: new Date(slot.start),
          end: new Date(slot.end),
          color: 'rgba(139, 195, 74, 0.3)', // More transparent light green
          textColor: '#4a5568', // Darker text for better readability
          rendering: 'background',
          display: 'background',
          backgroundColor: 'rgba(139, 195, 74, 0.3)', 
          borderColor: 'rgba(139, 195, 74, 0.5)'
        }));
        
        setAvailabilitySlots(formattedSlots);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch availability');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  return { availabilitySlots, loading, error, setAvailabilitySlots };
};