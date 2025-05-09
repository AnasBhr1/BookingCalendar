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
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmed</span>;
      case 'canceled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Canceled</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Pending</span>;
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
            alertType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {alertMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">You don't have any bookings yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {moment(booking.start).format('MMM D, YYYY h:mm A')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {moment(booking.end).format('MMM D, YYYY h:mm A')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditBooking(booking)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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