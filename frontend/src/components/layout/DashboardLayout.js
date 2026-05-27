import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();
  const showSidebar = user && (window.location.pathname !== '/' && window.location.pathname !== '/login' && window.location.pathname !== '/register');

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      {showSidebar && <Sidebar />}
      <main className={`pt-16 ${showSidebar ? 'lg:ml-64' : ''} min-h-screen`}>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
