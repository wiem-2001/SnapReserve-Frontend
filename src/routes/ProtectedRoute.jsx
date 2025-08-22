import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { getMe, user: authUser } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!authUser) {
          await getMe();
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setChecking(false);
      }
    };
    fetchUser();
  }, []); 

  const role = authUser?.user?.role;

  if (checking) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!authUser) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
