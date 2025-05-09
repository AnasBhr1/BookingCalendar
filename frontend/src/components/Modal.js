import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="z-10 max-w-md w-full dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
};

export default Modal;