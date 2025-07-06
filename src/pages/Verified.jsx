
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Verified = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); 
    }, 4000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Email Verified Successfully!</h1>
      <p>You will be redirected to the login page shortly...</p>
    </div>
  );
};

export default Verified;
