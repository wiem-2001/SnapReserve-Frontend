import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4" style={{marginTop: '100px'}}>
      <AlertTriangle className="w-24 h-24 text-red-500 mb-6" size={170} style={{ color: '#f9cc05' }}/>

      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-center text-gray-600 mb-6 max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Go to Homepage
      </Link>
    </div>
  );
}

export default NotFound;
