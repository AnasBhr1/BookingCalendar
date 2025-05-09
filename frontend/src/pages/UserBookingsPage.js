import React, { useState } from 'react';
import { useBookings } from '../hooks/useBookings';
import { deleteBooking } from '../services/bookingService';
import Modal from '../components/Modal';
import BookingForm from '../components/BookingForm';
import moment from 'moment';

const UserBookingsPage = () => {
  const { bookings, loading, error, setBookings } = useBookings();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(bookingId);
        setBookings(bookings.filter(b => b._id !== bookingId));
        showAlert('Booking deleted successfully', 'success');
      } catch (error) {
        showAlert('Failed to delete booking', 'error');
      }
    }
  };

  const handleBookingUpdated = async () => {
    try {
      // Refetch bookings
      const response = await fetch(`http://localhost:5000/api/bookings/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      
      // Format dates for display
      const formattedBookings = data.map(booking => ({
        ...booking,
        start: new Date(booking.start),
        end: new Date(booking.end),
        color: getStatusColor(booking.status)
      }));
      
      setBookings(formattedBookings);
      setModalOpen(false);
      showAlert('Booking updated successfully', 'success');
    } catch (error) {
      showAlert('Failed to update bookings', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    
    setTimeout(() => {
      setAlertMessage('');
      setAlertType('');
    }, 5000);
  };

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs rounded-full">Confirmed</span>;
      case 'canceled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 text-xs rounded-full">Canceled</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs rounded-full">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {alertMessage && (
        <div 
          className={`mb-4 p-3 rounded ${
            alertType === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
          }`}
        >
          {alertMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded">
          {error}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 dark:text-gray-400">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <div 
              key={booking._id} 
              className={`
                rounded-lg shadow-md overflow-hidden border-t-4
                ${booking.status === 'confirmed' ? 'border-green-500' : 
                  booking.status === 'canceled' ? 'border-red-500' : 'border-blue-500'}
              `}
            >
              <div className="bg-white dark:bg-gray-800 p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold dark:text-white">{booking.title}</h3>
                  {getStatusBadge(booking.status)}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      {moment(booking.start).format('MMM D, YYYY')}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      {moment(booking.start).format('h:mm A')} - {moment(booking.end).format('h:mm A')}
                    </span>
                  </div>
                  
                  {booking.notes && (
                    <div className="flex items-start mt-3">
                      <svg className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{booking.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEditBooking(booking)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <BookingForm 
          existingBooking={selectedBooking}
          onClose={() => setModalOpen(false)}
          onBookingCreated={handleBookingUpdated}
        />
      </Modal>
    </div>
  );
};

export default UserBookingsPage;