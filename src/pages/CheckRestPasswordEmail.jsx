import React from 'react';
import { MailCheck } from 'lucide-react';
const CheckResetPasswordEmail = () => {
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
              Check Your Email
            </h1>
            
            <p >
               If an account is associated with the email you provided, a password reset link has been sent.
              <br />
              Please check your inbox and spam folder.
            </p>
            <p>
              If you remembered your password please use the link bellow.
            </p>
       <a href="/login" style={{color:"#1f2937"}}>Return to Login</a>
    </div>
  );
};

export default CheckResetPasswordEmail;
