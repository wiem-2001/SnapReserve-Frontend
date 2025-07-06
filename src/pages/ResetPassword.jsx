import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage/LoginPage.css'; 
import logo from '../assets/logo.png'; 
import useAuthStore from '../stores/authStore'; // if using Zustand

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useAuthStore(state => state.resetPassword); // Zustand

  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  // Parse token & id from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get('token') || '');
    setUserId(params.get('id') || '');
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await resetPassword({
        userId,
        token,
        newPassword: formData.newPassword
      });
      alert('Password reset successful. You can now log in.');
      navigate('/login');
    } catch (err) {
      alert(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <div className="login-left">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" className="login-button">
              Reset Password
            </button>
          </form>
          <div className="signup-link">
            Know your password? <a href="/login">Login instead</a>
          </div>
        </div>
        <div className="login-right">
          <div className="logo-header">
            <img src={logo} className="logo" alt="SnapReserve Logo" />
            <h2>SnapReserve</h2>
          </div>
          <p className="slogan">
            Secure your spot at the hottest events in town with just a few clicks.
          </p>
          <div className="features">
            <p> Instant ticket delivery</p>
            <p> Easy refunds & exchanges</p>
            <p> Real-time event updates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
