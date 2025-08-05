import {create} from 'zustand';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL; 

const useSocketStore = create((set) => {
  const socket = io(SOCKET_URL, {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log(' Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log(' Socket disconnected');
  });

  socket.on('fraud-alert', (data) => {
    console.log(' Fraud alert received:', data);
    set({ fraudAlert: data });
  });

  return {
    socket,
    fraudAlert: null,
    registerUser: (userId) => {
      socket.emit('register-user', userId);
    },
    clearFraudAlert: () => set({ fraudAlert: null }),
  };
  
},

);

export default useSocketStore;
