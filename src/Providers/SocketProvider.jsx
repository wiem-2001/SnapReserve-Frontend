import React, { useEffect } from 'react';
import useAuth from '../stores/authStore';        
import useSocketStore from '../stores/socketStore';

export default function SocketProvider({ children }) {
  const { user: authUser, getMe } = useAuth();
  const { socket, registerUser } = useSocketStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        await getMe();     
      } catch {
        
      }
    };
    loadUser();
  }, [getMe]);
  
  useEffect(() => {
    if (socket && authUser?.user?.id) {
      registerUser(authUser?.user?.id); 
    }
  }, [socket, authUser?.user?.id]);

  return <>{children}</>;
}
