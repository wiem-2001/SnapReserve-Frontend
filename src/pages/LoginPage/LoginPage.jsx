  import React, { useState } from 'react';
  import { FaGoogle, FaFacebook } from 'react-icons/fa';
  import './LoginPage.css';
  import logo from '../../assets/logo.png'; 
  import useAuthStore from '../../stores/authStore';
  import { useNavigate } from 'react-router-dom';

  const LoginPage = () => {
    const signin = useAuthStore(state => state.signin);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      email: '',
      password: ''
    });

    const [error, setError] = useState(''); 

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setError('');
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const token = await signin(formData);
        navigate('/');
      } catch (error) {
          setError(error.response?.data?.message);
      }
    };

    const handleGoogleLogin = () => {
      window.location.href = import.meta.env.VITE_API_URL + '/auth/google';
    };

    return (
      <div className="app-container">
        <div className="login-container">
          <div className="login-left">
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
             
              {error && <div className="error-message">{error}</div>}
              
              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
              
              <button type="submit" className="login-button">Login</button>
              
              <div className="social-login">
                <p>Or login with</p>
                <div className="social-buttons">
                  <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                    <FaGoogle /> Google
                  </button>
                  <button type="button" className="facebook-btn">
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
            <div className='logo-header'>
              <img src={logo} className="logo" alt="SnapReserve Logo" />
              <h2>SnapReserve</h2>
            </div>
            <p className="slogan">
              Secure your spot at the hottest events in town with just a few clicks.
            </p>
            <div className="features">
              <p> Instant ticket delivery</p>
              <p> Easy refunds & exchanges</p>
              <p>Real-time event updates</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default LoginPage;
