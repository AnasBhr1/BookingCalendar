import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { getAllBookings } from '../services/bookingService';
import { getAllUsers } from '../services/userService';
import moment from 'moment';

const AdminDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings and users in parallel
      const [bookingsData, usersData] = await Promise.all([
        getAllBookings(),
        getAllUsers()
      ]);
      
      setBookings(bookingsData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const prepareBookingsByStatusData = () => {
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      canceled: 0
    };
    
    bookings.forEach(booking => {
      statusCounts[booking.status]++;
    });
    
    return [
      { name: 'Pending', value: statusCounts.pending },
      { name: 'Confirmed', value: statusCounts.confirmed },
      { name: 'Canceled', value: statusCounts.canceled }
    ];
  };

  const prepareBookingsByTimeData = () => {
    let format;
    let startDate;
    let groupBy;
    
    if (timeRange === 'week') {
      format = 'ddd'; // e.g., Mon, Tue
      startDate = moment().subtract(7, 'days');
      groupBy = 'day';
    } else if (timeRange === 'month') {
      format = 'MMM D'; // e.g., Jan 1
      startDate = moment().subtract(30, 'days');
      groupBy = 'day';
    } else {
      format = 'MMM'; // e.g., Jan, Feb
      startDate = moment().subtract(12, 'months');
      groupBy = 'month';
    }
    
    // Initialize data with all time periods
    const timeData = {};
    
    if (groupBy === 'day') {
      let current = startDate.clone();
      while (current <= moment()) {
        timeData[current.format(format)] = 0;
        current.add(1, 'day');
      }
    } else {
      let current = startDate.clone();
      while (current <= moment()) {
        timeData[current.format(format)] = 0;
        current.add(1, 'month');
      }
    }
    
    // Count bookings by time period
    bookings.forEach(booking => {
      const bookingDate = moment(booking.start);
      
      if (bookingDate >= startDate) {
        const key = bookingDate.format(format);
        if (timeData[key] !== undefined) {
          timeData[key]++;
        }
      }
    });
    
    // Convert to array format for Recharts
    return Object.keys(timeData).map(key => ({
      name: key,
      bookings: timeData[key]
    }));
  };

  const prepareUserRolesData = () => {
    const roleCounts = {
      admin: 0,
      user: 0
    };
    
    users.forEach(user => {
      roleCounts[user.role]++;
    });
    
    return [
      { name: 'Admins', value: roleCounts.admin },
      { name: 'Users', value: roleCounts.user }
    ];
  };

  // Colors for charts
  const COLORS = ['#2196F3', '#4CAF50', '#F44336', '#FFC107'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Bookings</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{bookings.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{users.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Confirmed Bookings</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {bookings.filter(b => b.status === 'confirmed').length}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Bookings by Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareBookingsByStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareBookingsByStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Roles</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareUserRolesData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareUserRolesData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bookings Over Time</h2>
          <div className="space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 rounded ${
                timeRange === 'week' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 rounded ${
                timeRange === 'month' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 rounded ${
                timeRange === 'year' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={prepareBookingsByTimeData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#4F46E5" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;