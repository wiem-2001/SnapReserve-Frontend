import React from 'react'
import { MailCheck } from 'lucide-react';
function VerifyEmail() {
  return (

   <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4" style={{marginTop: '100px'}}>
      <div className="animate-bounce mb-6 mt-20">
             <MailCheck className="w-24 h-24 text-blue-600" size={170} style={{ color: '#f9cc05' }} />
      </div>
      <h1 className="text-2xl font-semibold text-center">
        Check your email to verify your account
      </h1>
      <p className="mt-2 text-center text-gray-500 max-w-sm">
        We've sent a verification link to your inbox. Please confirm your email to proceed.
      </p>
    </div>
  )
}

export default VerifyEmail
