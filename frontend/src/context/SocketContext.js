import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join user-specific room when user changes
  useEffect(() => {
    if (socket && currentUser) {
      socket.emit('join', currentUser.id);
    }
  }, [socket, currentUser]);

  const value = {
    socket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};