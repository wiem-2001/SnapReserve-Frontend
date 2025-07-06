import React, { useState } from 'react';
import './LoginPage/LoginPage.css';
import logo from '../assets/logo.png'; 
import useAuthStore from '../stores/authStore'; 
import { useNavigate } from 'react-router-dom';


const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const forgetPassword = useAuthStore(state => state.forgetPassword);
  const navigate = useNavigate();

  const handleForgetPassword = async (e) => {
    e.preventDefault(); 
    try {
      await forgetPassword({ email });
      navigate('/check-email');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "An error occurred.";
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <div className="login-left">
          <h1>Forgot Password</h1>
          <form onSubmit={handleForgetPassword} className="login-form">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              Send Reset Link
            </button>
          </form>
          <div className="signup-link">
            Remembered your password? <a href="/login">Back to Login</a>
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
export default ForgetPasswordPage;
