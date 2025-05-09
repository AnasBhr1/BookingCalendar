import { useState, useEffect } from 'react';
import { getUserBookings, getAllBookings } from '../services/bookingService';
import { useAuth } from './useAuth';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        let data;
        
        if (isAdmin()) {
          data = await getAllBookings();
        } else {
          data = await getUserBookings();
        }
        
        // Format dates for FullCalendar
        const formattedBookings = data.map(booking => ({
          ...booking,
          title: booking.title,
          start: new Date(booking.start),
          end: new Date(booking.end),
          color: getStatusColor(booking.status)
        }));
        
        setBookings(formattedBookings);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAdmin]);

  // Helper function to get color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'canceled':
        return '#F44336'; // Red
      default:
        return '#2196F3'; // Blue (pending)
    }
  };

  return { bookings, loading, error, setBookings };
};