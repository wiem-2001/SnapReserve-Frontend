import React from 'react';
import { MailCheck } from 'lucide-react';
const CheckResetPasswordEmail = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4" style={{marginTop: '100px'}}>
      
      <h1>Check Your Email</h1>
      
      <p>
        If an account is associated with the email you provided, a password reset link has been sent.
        <br />
        Please check your inbox and spam folder.
      </p>
      <p>
        If you didn’t request this, you can safely ignore the email.
      </p>
      <a href="/login">Return to Login</a>
    </div>
  );
};

export default CheckResetPasswordEmail;
