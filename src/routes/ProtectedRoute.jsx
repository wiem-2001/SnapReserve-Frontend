import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { useEffect, useState, useRef } from 'react';
import { Spin } from 'antd';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { getMe, user: authUser, logout } = useAuthStore();
  const [checking, setChecking] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const checkAuthAndSetExpiration = async () => {
      try {
        if (!authUser) {
          await getMe();
        }

        const token = Cookies.get('token');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;

            if (timeUntilExpiration <= 0) {
              logout();
            } else {
              timeoutRef.current = setTimeout(() => {
                logout();
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
              }, timeUntilExpiration);
            }
          } catch (error) {
            console.error('Token parsing error:', error);
          }
        }
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setChecking(false);
      }
    };

    checkAuthAndSetExpiration();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [authUser, getMe, logout]);

  const role = authUser?.user?.role;

  if (checking) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!authUser) {
    const returnUrl = window.location.pathname + window.location.search;
    return <Navigate to={`/login?redirect=${encodeURIComponent(returnUrl)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;