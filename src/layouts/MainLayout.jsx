import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div className="layout-container bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm safe-area-top">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="font-bold text-lg text-gray-900 dark:text-white">Profile PWA</div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <button 
              onClick={logout}
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;