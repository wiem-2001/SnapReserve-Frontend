import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import '../pages/CreateEvent/CreateEvent.css';
import  useAuthStore  from '../stores/authStore';
const VerifyExpired = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {loading , resendVerificationEmail} = useAuthStore()
  
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const errorMessage = queryParams.get('message');
  
  const handleResend = async (values) => {
    try {
      const emailToUse = values?.email || email;
       await resendVerificationEmail({ email: emailToUse });
      setTimeout(() => navigate('/verify-email'), 2000);
    } catch (error) {
      message.error('Failed to send verification email. Please try again.');
    } 
  };

  if (errorMessage) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'white',
        color: '#1f2937'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <AlertCircle 
            style={{ color: '#ef4444' }} 
            size={100}
          />
        </div>

        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '0.5rem'
        }}>
          Verification Failed
        </h1>
        
        <p style={{
          color: '#6b7280',
          marginBottom: '2rem',
          maxWidth: '24rem'
        }}>
          {errorMessage}
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button 
            className='dark-btn' 
            onClick={() => navigate('/signup')}
            size="large"
          >
            Sign Up Again
          </Button>
          <Button 
            onClick={() => navigate('/')}
            size="large"
            className='light-btn'
          >
            Go Home
          </Button>
        </div>

        <div style={{ maxWidth: '400px', margin: '2rem auto 0', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
          <p style={{ margin: '0', fontSize: '0.875rem', color: '#4b5563' }}>
            <strong>Troubleshooting Tips:</strong>
          </p>
          <ul style={{ textAlign: 'left', margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#4b5563' }}>
            <li>Make sure you're using the most recent verification email</li>
            <li>Try copying and pasting the link directly into your browser</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'white',
      color: '#1f2937'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Clock 
          style={{ color: 'red' }} 
          size={100}
        />
      </div>

      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '0.5rem'
      }}>
        Verification Link Expired
      </h1>
      
      <p style={{
        color: '#6b7280',
        marginBottom: '2rem',
        maxWidth: '24rem'
      }}>
        Your verification link has expired. Please request a new verification email to continue.
      </p>

        {email ? (
        <div style={{ width: '100%', maxWidth: '24rem' }}>
          <p style={{ marginBottom: '1rem', color: '#4b5563' }}>
            We'll send a new verification link to: <strong>{email}</strong>
          </p>
          <Button 
            className="dark-btn" 
            onClick={() => handleResend({ email })}
            loading={loading}
            size="large"
            style={{ width: '100%' }}
          >
            Resend Verification Email
          </Button>
        </div>
      ) : (
        <Form
          onFinish={handleResend}
          style={{ width: '100%', maxWidth: '24rem' }}
          layout="vertical"
        >
          <Form.Item
            label="Enter your email address"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              placeholder="Email address" 
              size="large"
              style={{ padding: '10px' }}
            />
          </Form.Item>
          <Button 
            className="dark-btn" 
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ width: '100%' }}
          >
            Resend Verification Email
          </Button>
        </Form>
      )}
    </div>
  );
};

export default VerifyExpired;