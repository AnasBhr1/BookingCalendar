import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBooking, deleteBooking } from '../services/bookingService';
import Modal from '../components/Modal';
import BookingForm from '../components/BookingForm';
import moment from 'moment';

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'canceled'

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      
      // Format dates
      const formattedBookings = data.map(booking => ({
        ...booking,
        start: new Date(booking.start),
        end: new Date(booking.end)
      }));
      
      setBookings(formattedBookings);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

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

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const booking = bookings.find(b => b._id === bookingId);
      
      if (!booking) return;
      
      await updateBooking(bookingId, { ...booking, status: newStatus });
      
      // Update booking in state
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: newStatus } : b
      ));
      
      showAlert(`Booking status updated to ${newStatus}`, 'success');
    } catch (error) {
      showAlert('Failed to update booking status', 'error');
    }
  };

  const handleBookingUpdated = async () => {
    try {
      await fetchAllBookings();
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

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      
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
      
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${
            filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${
            filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded ${
            filter === 'confirmed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Confirmed
        </button>
        <button 
          onClick={() => setFilter('canceled')}
          className={`px-4 py-2 rounded ${
            filter === 'canceled' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Canceled
        </button>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 dark:text-gray-400">No bookings found.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map(booking => (
                <tr 
                  key={booking._id}
                  className={`
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    ${booking.status === 'confirmed' ? 'bg-green-50 dark:bg-green-900/20' : 
                      booking.status === 'canceled' ? 'bg-red-50 dark:bg-red-900/20' : ''}
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {booking.user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {booking.title}
                    </div>
                    {booking.notes && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {booking.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {moment(booking.start).format('MMM D, YYYY')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {moment(booking.start).format('h:mm A')} - {moment(booking.end).format('h:mm A')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
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
                      <div className="ml-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="canceled">Cancel</option>
                        </select>
                      </div>
                    </div>
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

export default AdminBookingsPage;