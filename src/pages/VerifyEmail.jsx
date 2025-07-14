
import React from 'react';
import { MailCheck } from 'lucide-react';

function VerifyEmail() {
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
      <div style={{ 
        animation: 'bounce 1s infinite',
        marginBottom: '1.5rem'
      }}>
        <MailCheck 
          style={{ 
            color: '#f9cc05' ,
          }} 
          size={170}
        />
      </div>

      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '0.5rem'
      }}>
        Check your email to verify your account
      </h1>
      
      <p style={{
        color: '#6b7280', 
        marginBottom: '1rem',
        maxWidth: '24rem'
      }}>
        We've sent a verification link to your inbox. Please confirm your email to proceed.
      </p>
    </div>
  );
}

export default VerifyEmail;

