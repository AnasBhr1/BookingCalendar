import React from 'react';
import { Calendar, Clock, AlertCircle, Check, X, User, FileText } from 'lucide-react';
import moment from 'moment';

const BookingCard = ({ booking, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default: // pending
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'canceled':
        return <X className="h-4 w-4" />;
      default: // pending
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={onClick}
    >
      <div className={`p-1 text-center text-xs font-medium uppercase ${getStatusColor(booking.status)}`}>
        <div className="flex items-center justify-center">
          {getStatusIcon(booking.status)}
          <span className="ml-1">{booking.status}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{booking.title}</h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              {moment(booking.start).format('dddd, MMMM D, YYYY')}
            </span>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              {moment(booking.start).format('h:mm A')} - {moment(booking.end).format('h:mm A')}
            </span>
          </div>
          
          {booking.userName && (
            <div className="flex items-start">
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {booking.userName}
              </span>
            </div>
          )}
          
          {booking.notes && (
            <div className="flex items-start">
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
              <span className="text-gray-700 dark:text-gray-300 line-clamp-2">
                {booking.notes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;