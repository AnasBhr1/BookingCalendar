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
          color: '#8BC34A', // Light green
          rendering: 'background'
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