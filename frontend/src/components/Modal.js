import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Add a slight delay for the close animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Restore body scrolling
        document.body.style.overflow = 'visible';
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen && !isVisible) return null;
  
  // Modal size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  const modalSize = sizeClasses[size] || sizeClasses.md;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className={`${modalSize} w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-200 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} z-10 overflow-hidden`}>
        {/* Modal Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Modal Body */}
        <div className={`${!title ? 'pt-6' : ''} overflow-y-auto max-h-[calc(100vh-150px)]`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;