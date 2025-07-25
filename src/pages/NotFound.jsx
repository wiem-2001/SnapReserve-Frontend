
import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

function NotFound() {
  const { getMe, user: authUser } = useAuthStore();

  useEffect(() => {
    if (!authUser) getMe();
  }, [authUser, getMe]);

  const role = authUser?.user?.role;
  const redirectPath = role === 'organizer' ? '/manage-events' : '/';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <AlertTriangle 
        
        style={{ color: '#f9cc05' }} 
        size={170}
      />

      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
        404 - Page Not Found
      </h1>
      
      <p style={{ 
        color: '#6b7280', 
        marginBottom: '1.5rem',
        maxWidth: '28rem'
      }}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link
        to={redirectPath}
        style={{
          backgroundColor: '#021529',
          color: '#ffd72d',
          padding: '16px 32px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          minWidth: '140px',
          textDecoration: 'none',
          display: 'inline-block',
          textAlign: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#06386e'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#021529'}
      >
        Go to Homepage
      </Link>
    </div>
  );
}
export default NotFound;

