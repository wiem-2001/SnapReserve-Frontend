import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage/LoginPage.css'; 
import logo from '../assets/logo.png'; 
import useAuthStore from '../stores/authStore';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const resetPassword = useAuthStore(state => state.resetPassword);

  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get('token') || '');
    setUserId(params.get('id') || '');
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        userId,
        token,
        newPassword: formData.newPassword
      });
      setSuccessMessage('Password reset successful. You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrorMessage(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <div className="login-left">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
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
            {errorMessage && (
              <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>
                {successMessage}
              </div>
            )}
            <button type="submit" className="login-button" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Reset Password'}
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
