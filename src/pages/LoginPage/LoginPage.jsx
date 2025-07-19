import React, { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import './LoginPage.css';
import logo from '../../assets/logo.png';
import useAuthStore from '../../stores/authStore';
import { useNavigate , useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const signin = useAuthStore(state => state.signin);
  const navigate = useNavigate();
   const location = useLocation();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setErrorMessage('');
    
    try {
      const token = await signin({ email, password });
      const decoded = jwtDecode(token);
      const role = decoded.role || decoded?.user?.role;
      
      if (role === 'organizer') {
        navigate('/manage-events');
      } else {
        const from = location.state?.from || '/';
        navigate(from);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message ;
      setErrorMessage(msg);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_API_URL + '/auth/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = import.meta.env.VITE_API_URL + '/auth/facebook';
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <div className="login-left">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                onBlur={() => {
                  if (email && !validateEmail(email)) {
                    setEmailError('Please enter a valid email address');
                  }
                }}
                required
                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                title="Please include '@' in the email address"
                className={emailError ? 'input-error' : ''}
              />
              {emailError && (
                <div className="error-message">
                  {emailError}
                </div>
              )}
            </div>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {errorMessage && (
              <div className="error-message" style={{ marginBottom: '10px' }}>
                {errorMessage}
              </div>
            )}

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            <div className="social-login">
              <p>Or login with</p>
              <div className="social-buttons">
                <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                  <FaGoogle /> Google
                </button>
                <button type="button" className="facebook-btn" onClick={handleFacebookLogin}>
                  <FaFacebook /> Facebook
                </button>
              </div>
            </div>
          </form>

          <div className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
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

export default LoginPage;