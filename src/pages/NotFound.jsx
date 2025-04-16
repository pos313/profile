import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      
      <Button asChild>
        <Link to={isAuthenticated ? "/profile" : "/login"}>
          {isAuthenticated ? "Go to Profile" : "Go to Login"}
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;