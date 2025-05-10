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
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../context/SocketContext';
import { useDarkMode } from '../hooks/useDarkMode';
import { Calendar, Clock, Filter, ChevronDown, ChevronLeft, ChevronRight, AlertCircle, Check, X, Info, Edit, Trash2, RefreshCw } from 'lucide-react';
import moment from 'moment';

const CalendarPage = () => {
  const { bookings, loading: bookingsLoading, setBookings } = useBookings();
  const { availabilitySlots, loading: availabilityLoading, setAvailabilitySlots } = useAvailability();
  const { currentUser, isAdmin } = useAuth();
  const { socket } = useSocket();
  const { darkMode } = useDarkMode();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [view, setView] = useState('timeGridWeek');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [showAvailability, setShowAvailability] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
          color: 'rgba(139, 195, 74, 0.3)',
          textColor: '#4a5568',
          rendering: 'background',
          display: 'background'
        };
        setAvailabilitySlots(prevSlots => [...prevSlots, newSlot]);
      } else if (data.action === 'update') {
        // Format for FullCalendar
        const updatedSlot = {
          ...data.slot,
          title: 'Available',
          start: new Date(data.slot.start),
          end: new Date(data.slot.end),
          color: 'rgba(139, 195, 74, 0.3)',
          textColor: '#4a5568',
          rendering: 'background',
          display: 'background'
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
      // Alert will be shown by checkIfAvailable if there's a conflict
      return;
    }
    
    setSelectedSlot({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setSelectedBooking(null);
    setIsEditMode(false);
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
      setIsEditMode(false);
      setModalOpen(true);
    } else {
      showAlert('You can only view and edit your own bookings', 'error');
    }
  };

  const handleEventDrop = async (eventDropInfo) => {
    // Get booking ID from event
    const bookingId = eventDropInfo.event.extendedProps._id;
    
    if (!bookingId) return;
    
    // Find booking from state
    const booking = bookings.find(b => b._id === bookingId);
    
    if (!booking) return;
    
    // Check if current user is the owner or an admin
    if (booking.user !== currentUser.id && !isAdmin()) {
      eventDropInfo.revert();
      showAlert('You can only reschedule your own bookings', 'error');
      return;
    }
    
    // Get new start and end times
    const newStart = eventDropInfo.event.start;
    const newEnd = eventDropInfo.event.end;
    
    // Check if the new time slot is available
    const isAvailable = checkIfAvailable(newStart, newEnd, bookingId);
    
    if (!isAvailable) {
      eventDropInfo.revert();
      return; // Alert shown by checkIfAvailable
    }
    
    try {
      // Update booking with new times
      await updateBooking(bookingId, {
        ...booking,
        start: newStart,
        end: newEnd
      });
      
      // Update local state (socket will handle real-time update)
      showAlert('Booking rescheduled successfully', 'success');
    } catch (error) {
      eventDropInfo.revert();
      showAlert('Failed to reschedule booking', 'error');
    }
  };

  const handleEventResize = async (eventResizeInfo) => {
    // Get booking ID from event
    const bookingId = eventResizeInfo.event.extendedProps._id;
    
    if (!bookingId) return;
    
    // Find booking from state
    const booking = bookings.find(b => b._id === bookingId);
    
    if (!booking) return;
    
    // Check if current user is the owner or an admin
    if (booking.user !== currentUser.id && !isAdmin()) {
      eventResizeInfo.revert();
      showAlert('You can only resize your own bookings', 'error');
      return;
    }
    
    // Get new end time
    const newEnd = eventResizeInfo.event.end;
    
    // Check if the new time slot is available
    const isAvailable = checkIfAvailable(booking.start, newEnd, bookingId);
    
    if (!isAvailable) {
      eventResizeInfo.revert();
      return; // Alert shown by checkIfAvailable
    }
    
    try {
      // Update booking with new end time
      await updateBooking(bookingId, {
        ...booking,
        end: newEnd
      });
      
      // Update local state (socket will handle real-time update)
      showAlert('Booking updated successfully', 'success');
    } catch (error) {
      eventResizeInfo.revert();
      showAlert('Failed to update booking', 'error');
    }
  };

  const handleBookingCreated = async () => {
    try {
      // Refetch bookings to update the calendar
      setIsRefreshing(true);
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
      setIsRefreshing(false);
    } catch (error) {
      showAlert('Failed to update bookings', 'error');
      setIsRefreshing(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await deleteBooking(selectedBooking._id);
      
      // Remove from local state (socket will handle real-time update)
      setModalOpen(false);
      showAlert('Booking deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete booking', 'error');
    }
  };

  const handleEditBooking = () => {
    setIsEditMode(true);
  };

  const checkIfAvailable = (start, end, excludeBookingId = null) => {
    // If user is admin, they can book any time
    if (isAdmin()) return true;
    
    const startTime = moment(start);
    const endTime = moment(end);
    
    // Check for conflicts with existing bookings
    const conflictingBooking = bookings.find(booking => {
      if (excludeBookingId && booking._id === excludeBookingId) return false;
      
      const bookingStart = moment(booking.start);
      const bookingEnd = moment(booking.end);
      
      // Check if the selected time overlaps with this booking
      return (
        (startTime.isSameOrAfter(bookingStart) && startTime.isBefore(bookingEnd)) ||
        (endTime.isAfter(bookingStart) && endTime.isSameOrBefore(bookingEnd)) ||
        (startTime.isSameOrBefore(bookingStart) && endTime.isSameOrAfter(bookingEnd))
      );
    });
    
    if (conflictingBooking) {
      showAlert(`This time slot conflicts with an existing booking: "${conflictingBooking.title}" from ${moment(conflictingBooking.start).format('h:mm A')} to ${moment(conflictingBooking.end).format('h:mm A')}`, 'error');
      return false;
    }
    
    // Check if there are any available slots that cover this time
    const available = availabilitySlots.some(slot => {
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
    
    if (!available) {
      showAlert('This time slot is not available for booking', 'error');
    }
    
    return available;
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch bookings and availability
      await Promise.all([
        fetchBookings(),
        fetchAvailability()
      ]);
      showAlert('Calendar refreshed successfully', 'success');
    } catch (error) {
      showAlert('Failed to refresh calendar data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchBookings = async () => {
    try {
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
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/availability`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch availability');
      
      const data = await response.json();
      
      // Format for FullCalendar
      const formattedSlots = data.map(slot => ({
        ...slot,
        title: 'Available',
        start: new Date(slot.start),
        end: new Date(slot.end),
        color: 'rgba(139, 195, 74, 0.3)',
        textColor: '#4a5568',
        rendering: 'background',
        display: 'background'
      }));
      
      setAvailabilitySlots(formattedSlots);
    } catch (error) {
      throw new Error('Failed to fetch availability');
    }
  };
  
  const renderEventContent = (eventInfo) => {
    // Check if this is a booking event (not availability)
    const isBooking = eventInfo.event.extendedProps._id && !eventInfo.event.rendering;
    
    if (!isBooking) return null; // For availability slots, use default rendering
    
    const status = eventInfo.event.extendedProps.status || 'pending';
    
    // Get status-specific styling
    const getStatusStyles = () => {
      switch (status) {
        case 'confirmed':
          return 'bg-green-600 border-green-700';
        case 'canceled':
          return 'bg-red-600 border-red-700';
        default: // pending
          return 'bg-blue-600 border-blue-700';
      }
    };
    
    // Get user who made the booking (if available)
    const userName = eventInfo.event.extendedProps.userName || '';
    
    return (
      <div className={`p-1 rounded-md border-l-4 w-full h-full overflow-hidden ${getStatusStyles()}`}>
        <div className="font-bold text-white truncate">{eventInfo.event.title}</div>
        {userName && (
          <div className="text-xs text-white opacity-90 truncate">
            Booked by: {userName}
          </div>
        )}
        <div className="text-xs text-white opacity-90">
          {moment(eventInfo.event.start).format('h:mm A')} - {moment(eventInfo.event.end).format('h:mm A')}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
            Booking Calendar
          </h1>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <div className="relative inline-block">
              <button
                onClick={() => setShowAvailability(!showAvailability)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAvailability ? 'Hide Availability' : 'Show Availability'}
              </button>
            </div>
          </div>
        </div>
        
        {alertMessage && (
          <div 
            className={`mb-6 p-4 rounded-md border flex items-start ${
              alertType === 'error'
                ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                : 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {alertType === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
              ) : (
                <Check className="h-5 w-5 text-green-400 dark:text-green-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm">{alertMessage}</p>
            </div>
            <button
              onClick={() => {
                setAlertMessage('');
                setAlertType('');
              }}
              className="ml-auto flex-shrink-0 -mt-1 -mr-1 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">Calendar Guide</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleViewChange('timeGridDay')}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    view === 'timeGridDay' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Day</span>
                  </span>
                </button>
                <button 
                  onClick={() => handleViewChange('timeGridWeek')}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    view === 'timeGridWeek' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Week</span>
                  </span>
                </button>
                <button 
                  onClick={() => handleViewChange('dayGridMonth')}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    view === 'dayGridMonth' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Month</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Booking Status:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-600 mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Confirmed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-600 mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Canceled</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded bg-green-200 mr-2"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Available Time</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Actions:</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span> 
                    Click and drag to create a new booking
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span> 
                    Click a booking to view details or make changes
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span> 
                    Drag bookings to reschedule them
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span> 
                    Drag the bottom edge to adjust duration
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
          {(bookingsLoading || availabilityLoading || isRefreshing) && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="mt-2 text-indigo-600 dark:text-indigo-400">Loading calendar...</p>
              </div>
            </div>
          )}
          
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
            events={[...bookings, ...(showAvailability ? availabilitySlots : [])]}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            eventContent={renderEventContent}
            editable={true}
            height="auto"
            allDaySlot={false}
            slotDuration="00:30:00"
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            slotLabelClassNames={(arg) => {
              // Customize time slot labels
              const hour = arg.date.getHours();
              if (hour < 9 || hour >= 18) {
                return 'text-gray-400'; // Outside business hours
              }
              return 'font-medium text-gray-700 dark:text-gray-300'; // Business hours
            }}
            // Add custom CSS classes to time slots
            slotLaneClassNames="hover:bg-gray-100 dark:hover:bg-gray-700"
            // Style today's column differently
            dayCellClassNames={(arg) => {
              return arg.isToday ? 'bg-blue-50 dark:bg-blue-900/20' : '';
            }}
          />
        </div>
      </div>
      
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={selectedBooking ? (isEditMode ? 'Edit Booking' : 'Booking Details') : 'Create New Booking'}
        size="md"
      >
        {selectedBooking && !isEditMode ? (
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</h3>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{selectedBooking.title}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Time</h3>
                  <p className="text-gray-900 dark:text-white">
                    {moment(selectedBooking.start).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">End Time</h3>
                  <p className="text-gray-900 dark:text-white">
                    {moment(selectedBooking.end).format('MMM D, YYYY h:mm A')}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedBooking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : selectedBooking.status === 'canceled' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
              <button
                onClick={handleDeleteBooking}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
              <button
                onClick={handleEditBooking}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        ) : (
          <BookingForm 
            selectedSlot={selectedSlot}
            booking={isEditMode ? selectedBooking : null}
            onClose={() => setModalOpen(false)}
            onBookingCreated={handleBookingCreated}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default CalendarPage;