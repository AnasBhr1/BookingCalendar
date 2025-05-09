import React, { useState, useEffect } from 'react';
import { getAvailabilitySlots, deleteAvailabilitySlot } from '../services/availabilityService';
import Modal from '../components/Modal';
import AvailabilityForm from '../components/AvailabilityForm';
import moment from 'moment';

const AdminAvailabilityPage = () => {
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    fetchAvailabilitySlots();
  }, []);

  const fetchAvailabilitySlots = async () => {
    try {
      setLoading(true);
      const data = await getAvailabilitySlots();
      
      // Format dates
      const formattedSlots = data.map(slot => ({
        ...slot,
        start: new Date(slot.start),
        end: new Date(slot.end)
      }));
      
      setAvailabilitySlots(formattedSlots);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch availability slots');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      try {
        await deleteAvailabilitySlot(slotId);
        setAvailabilitySlots(availabilitySlots.filter(s => s._id !== slotId));
        showAlert('Availability slot deleted successfully', 'success');
      } catch (error) {
        showAlert('Failed to delete availability slot', 'error');
      }
    }
  };

  const handleAvailabilityCreated = async () => {
    try {
      await fetchAvailabilitySlots();
      setModalOpen(false);
      showAlert('Availability slot saved successfully', 'success');
    } catch (error) {
      showAlert('Failed to update availability slots', 'error');
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

  const formatDaysOfWeek = (daysOfWeek) => {
    if (!daysOfWeek || daysOfWeek.length === 0) return 'None';
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek.map(day => days[day]).join(', ');
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Availability</h1>
        <button 
          onClick={() => {
            setSelectedSlot(null);
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add Availability Slot
        </button>
      </div>
      
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
      
      {availabilitySlots.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600">No availability slots found. Create one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days of Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {availabilitySlots.map(slot => (
                <tr key={slot._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      slot.recurring 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {slot.recurring ? 'Recurring' : 'One-time'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {slot.recurring 
                        ? moment(slot.start).format('h:mm A') 
                        : moment(slot.start).format('MMM D, YYYY h:mm A')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {slot.recurring 
                        ? moment(slot.end).format('h:mm A') 
                        : moment(slot.end).format('MMM D, YYYY h:mm A')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {slot.recurring ? formatDaysOfWeek(slot.daysOfWeek) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditSlot(slot)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSlot(slot._id)}
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
        <AvailabilityForm 
          existingSlot={selectedSlot}
          onClose={() => setModalOpen(false)}
          onAvailabilityCreated={handleAvailabilityCreated}
        />
      </Modal>
    </div>
  );
};

export default AdminAvailabilityPage;