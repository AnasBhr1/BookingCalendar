import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useBookings } from '../hooks/useBookings';
import { useAvailability } from '../hooks/useAvailability';
import { createBooking, updateBooking, deleteBooking } from '../services/bookingService';
import Modal from '../components/Modal';
import BookingForm from '../components/BookingForm';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';
import moment from 'moment';

const CalendarPage = () => {
  const { bookings, loading: bookingsLoading, setBookings } = useBookings();
  const { availabilitySlots, loading: availabilityLoading, setAvailabilitySlots } = useAvailability();
  const { currentUser, isAdmin } = useAuth();
  const { socket } = useSocket();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState('timeGridWeek');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  
  const calendarRef = useRef(null);

  // Listen for real-time updates via socket
  useEffect(() => {
    if (!socket) return;

    // Handle booking updates
    socket.on('bookingUpdated', (data) => {
      if (data.action === 'create') {
        // Format dates for FullCalendar
        const newBooking = {
          ...data.booking,
          start: new Date(data.booking.start),
          end: new Date(data.booking.end),
          color: getStatusColor(data.booking.status)
        };
        setBookings(prevBookings => [...prevBookings, newBooking]);
      } else if (data.action === 'update') {
        // Format dates for FullCalendar
        const updatedBooking = {
          ...data.booking,
          start: new Date(data.booking.start),
          end: new Date(data.booking.end),
          color: getStatusColor(data.booking.status)
        };
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === updatedBooking._id ? updatedBooking : booking
          )
        );
      } else if (data.action === 'delete') {
        setBookings(prevBookings => 
          prevBookings.filter(booking => booking._id !== data.bookingId)
        );
      }
    });

    // Handle availability updates
    socket.on('availabilityUpdated', (data) => {
      if (data.action === 'create') {
        // Format for FullCalendar
        const newSlot = {
          ...data.slot,
          title: 'Available',
          start: new Date(data.slot.start),
          end: new Date(data.slot.end),
          color: '#8BC34A', // Light green
          rendering: 'background'
        };
        setAvailabilitySlots(prevSlots => [...prevSlots, newSlot]);
      } else if (data.action === 'update') {
        // Format for FullCalendar
        const updatedSlot = {
          ...data.slot,
          title: 'Available',
          start: new Date(data.slot.start),
          end: new Date(data.slot.end),
          color: '#8BC34A', // Light green
          rendering: 'background'
        };
        setAvailabilitySlots(prevSlots => 
          prevSlots.map(slot => 
            slot._id === updatedSlot._id ? updatedSlot : slot
          )
        );
      } else if (data.action === 'delete') {
        setAvailabilitySlots(prevSlots => 
          prevSlots.filter(slot => slot._id !== data.slotId)
        );
      }
    });

    // Clean up listeners on unmount
    return () => {
      socket.off('bookingUpdated');
      socket.off('availabilityUpdated');
    };
  }, [socket, setBookings, setAvailabilitySlots]);

  useEffect(() => {
    // Clear alert message after 5 seconds
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleDateSelect = (selectInfo) => {
    // Check if slot is within available slots
    const isAvailable = checkIfAvailable(selectInfo.start, selectInfo.end);
    
    if (!isAvailable) {
      showAlert('This time slot is not available for booking', 'error');
      return;
    }
    
    setSelectedSlot({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setSelectedBooking(null);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    // Get booking ID from event
    const bookingId = clickInfo.event.extendedProps._id;
    
    if (!bookingId) return;
    
    // Find booking from state
    const booking = bookings.find(b => b._id === bookingId);
    
    if (!booking) return;
    
    // Check if current user is the owner or an admin
    if (booking.user === currentUser.id || isAdmin()) {
      setSelectedBooking(booking);
      setSelectedSlot(null);
      setModalOpen(true);
    } else {
      showAlert('You can only view and edit your own bookings', 'error');
    }
  };

  const handleBookingCreated = async () => {
    try {
      // Refetch bookings to update the calendar
      const response = await fetch(`http://localhost:5000/api/bookings/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      const data = await response.json();
      
      // Format dates for FullCalendar
      const formattedBookings = data.map(booking => ({
        ...booking,
        title: booking.title,
        start: new Date(booking.start),
        end: new Date(booking.end),
        color: getStatusColor(booking.status)
      }));
      
      setBookings(formattedBookings);
      showAlert('Booking saved successfully', 'success');
    } catch (error) {
      showAlert('Failed to update bookings', 'error');
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await deleteBooking(selectedBooking._id);
      
      // Remove from local state
      setBookings(bookings.filter(b => b._id !== selectedBooking._id));
      
      setModalOpen(false);
      showAlert('Booking deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete booking', 'error');
    }
  };

  const checkIfAvailable = (start, end) => {
    // If user is admin, they can book any time
    if (isAdmin()) return true;
    
    const startTime = moment(start);
    const endTime = moment(end);
    
    // Check if there are any available slots that cover this time
    return availabilitySlots.some(slot => {
      const slotStart = moment(slot.start);
      const slotEnd = moment(slot.end);
      
      // Check if the selected time falls within an available slot
      if (slot.recurring) {
        // For recurring slots, check the day of week
        const selectedDay = startTime.day();
        return (
          slot.daysOfWeek.includes(selectedDay) &&
          startTime.hours() >= slotStart.hours() &&
          startTime.minutes() >= slotStart.minutes() &&
          endTime.hours() <= slotEnd.hours() &&
          endTime.minutes() <= slotEnd.minutes()
        );
      } else {
        // For one-time slots, check the exact time
        return (
          startTime.isSameOrAfter(slotStart) &&
          endTime.isSameOrBefore(slotEnd)
        );
      }
    });
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

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  if (bookingsLoading || availabilityLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Booking Calendar</h1>
      
      {alertMessage && (
        <div 
          className={`mb-4 p-3 rounded ${
            alertType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {alertMessage}
        </div>
      )}
      
      <div className="mb-4 flex space-x-2">
        <button 
          onClick={() => handleViewChange('timeGridDay')}
          className={`px-4 py-2 rounded ${
            view === 'timeGridDay' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Day
        </button>
        <button 
          onClick={() => handleViewChange('timeGridWeek')}
          className={`px-4 py-2 rounded ${
            view === 'timeGridWeek' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Week
        </button>
        <button 
          onClick={() => handleViewChange('dayGridMonth')}
          className={`px-4 py-2 rounded ${
            view === 'dayGridMonth' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Month
        </button>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={[...bookings, ...availabilitySlots]}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          allDaySlot={false}
          slotDuration="00:30:00"
          slotMinTime="07:00:00"
          slotMaxTime="21:00:00"
        />
      </div>
      
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        {selectedBooking ? (
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
            
            <div className="mb-4">
              <p><span className="font-medium">Title:</span> {selectedBooking.title}</p>
              <p>
                <span className="font-medium">Start:</span> {moment(selectedBooking.start).format('MMM D, YYYY h:mm A')}
              </p>
              <p>
                <span className="font-medium">End:</span> {moment(selectedBooking.end).format('MMM D, YYYY h:mm A')}
              </p>
              <p><span className="font-medium">Status:</span> {selectedBooking.status}</p>
              {selectedBooking.notes && (
                <p><span className="font-medium">Notes:</span> {selectedBooking.notes}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={handleDeleteBooking}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  // Switch to edit mode
                  setSelectedSlot(null);
                  // Keep the modalOpen state true
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <BookingForm 
            selectedSlot={selectedSlot}
            onClose={() => setModalOpen(false)}
            onBookingCreated={handleBookingCreated}
          />
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;