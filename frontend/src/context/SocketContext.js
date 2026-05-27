import React, { createContext, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const socketRef = React.useRef(null);

  useEffect(() => {
    if (user && token) {
      const SOCKET_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      socketRef.current = io(SOCKET_URL);
      socketRef.current.emit('join', user._id);

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user, token]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
};
