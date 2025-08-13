import React, { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import './SignUp.css'; 
import logo from '../../assets/logo.png';
import useAuthStore from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',  
    phone: '',
    role: 'attendee',
    birth_date: '' ,
    gender: '', 
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '', api: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

  
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.birth_date) {
      newErrors.birth_date = 'Birth date is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    setIsSubmitting(true);
    const { confirmPassword, ...signupData } = formData;
    if (signupData.birth_date) {
      signupData.birth_date = new Date(signupData.birth_date).toISOString();
    }
    await signup(signupData);
    navigate('/verify-email');
  } catch (error) {
    setErrors({ api: error.response?.data?.message });
  } finally {
    setIsSubmitting(false);
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
      <div className="signup-container">
        <div className="signup-left"> 
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit} className="signup-form" noValidate> 
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <div className="error-message">{errors.fullName}</div>}
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>
            
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
          <div className="form-group">
          <label>Birth Date</label>
          <input
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
          />
          {errors.birth_date && <div className="error-message">{errors.birth_date}</div>}
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">-- Select Gender --</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <div className="error-message">{errors.gender}</div>}
        </div>
            <div className="role-selection">
              <label className={`role-option ${formData.role === 'attendee' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="attendee"
                  checked={formData.role === 'attendee'}
                  onChange={handleChange}
                />
                <span>I want to attend events</span>
              </label>
              <label className={`role-option ${formData.role === 'organizer' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="organizer"
                  checked={formData.role === 'organizer'}
                  onChange={handleChange}
                />
                <span>I want to organize events</span>
              </label>
              {errors.role && <div className="error-message">{errors.role}</div>}
            </div>

            {errors.api && <div className="error-message">{errors.api}</div>}
            
            <button 
                type="submit" 
                className="signup-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Processing...</span> 
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <div className="social-buttons-signup">
              <button type="button" className="google-btn" onClick={handleGoogleLogin}>
                <FaGoogle  size={40}/> Continue with Google
              </button>
              <button type="button" className="facebook-btn" onClick={handleFacebookLogin}>
                <FaFacebook size={40}/> Continue with Facebook
              </button>
            </div>

          </form>
          
          <div className="login-redirect">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
        
         <div className="login-right">
              <div className='logo-header'> 
                <img src={logo} className="logo" alt="SnapReserve Logo" />
                <h2>SnapReserve </h2>
              </div>
                  <p className="slogan">
                    Secure your spot at the hottest events in town with just a few clicks.
                  </p>
                  <div className="features">
                    <p> Instant ticket delivery</p>
                    <p> Personalized event recommendations</p>
                    <p> Real-time event updates</p>
                  </div>
                </div>
      </div>
    </div>
  );
};

export default SignupPage;
