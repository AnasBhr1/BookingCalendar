import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { getAllBookings } from '../services/bookingService';
import { getAllUsers } from '../services/userService';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Calendar, Users, Clock, AlertTriangle, ChevronDown, RefreshCw, Check, X, Download } from 'lucide-react';
import moment from 'moment';

const AdminDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setTimeout(() => setRefreshing(false), 500); // Add a slight delay for visual feedback
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

  // Get recent bookings (last 5)
  const getRecentBookings = () => {
    return [...bookings]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  // Calculate booking statistics
  const getBookingStats = () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const canceledBookings = bookings.filter(b => b.status === 'canceled').length;
    
    return {
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: pendingBookings,
      canceled: canceledBookings,
      confirmationRate: totalBookings > 0 
        ? Math.round((confirmedBookings / totalBookings) * 100) 
        : 0
    };
  };

  // Colors for charts
  const COLORS = ['#6366F1', '#10B981', '#F43F5E', '#F59E0B'];

  if (loading) {
    return (
      <DashboardLayout requiresAdmin>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiresAdmin>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          
          <div className="mt-4 sm:mt-0 flex items-center">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            
            <button
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3">
                  <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getBookingStats().total}</p>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/10 px-5 py-2">
              <div className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                {getBookingStats().total > 0 ? `${getBookingStats().confirmationRate}% confirmation rate` : 'No bookings yet'}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-full p-3">
                  <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Confirmed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getBookingStats().confirmed}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/10 px-5 py-2">
              <div className="text-xs font-medium text-green-700 dark:text-green-300">
                {getBookingStats().total > 0 ? `${Math.round((getBookingStats().confirmed / getBookingStats().total) * 100)}% of total bookings` : 'No confirmed bookings'}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/30 rounded-full p-3">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getBookingStats().pending}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/10 px-5 py-2">
              <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                {getBookingStats().total > 0 ? `${Math.round((getBookingStats().pending / getBookingStats().total) * 100)}% of total bookings` : 'No pending bookings'}
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 rounded-full p-3">
                  <X className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Canceled</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{getBookingStats().canceled}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 px-5 py-2">
              <div className="text-xs font-medium text-red-700 dark:text-red-300">
                {getBookingStats().total > 0 ? `${Math.round((getBookingStats().canceled / getBookingStats().total) * 100)}% of total bookings` : 'No canceled bookings'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bookings by Status</h2>
            </div>
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
                    label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {prepareBookingsByStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Legend formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Breakdown</h2>
            </div>
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
                    label={({ name, percent }) => percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {prepareUserRolesData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                  <Legend formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">Bookings Over Time</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 rounded text-sm ${
                    timeRange === 'week' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 rounded text-sm ${
                    timeRange === 'month' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange('year')}
                  className={`px-3 py-1 rounded text-sm ${
                    timeRange === 'year' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={prepareBookingsByTimeData()}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#F9FAFB', 
                      borderColor: '#E5E7EB',
                      borderRadius: '0.375rem',
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#6366F1" 
                    fillOpacity={1} 
                    fill="url(#colorBookings)" 
                    name="Bookings"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {getRecentBookings().map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {booking.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {booking.userName || 'Unknown User'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {moment(booking.start).format('MMM D, YYYY h:mm A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : booking.status === 'canceled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                
                {getRecentBookings().length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                      No recent bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <a href="/admin/bookings" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              View all bookings →
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;