import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';

/**
 * LayoutWrapper - A wrapper component for React Router v6 nested routes
 */
const LayoutWrapper = () => {
  const location = useLocation();
  
  // Debug: log when location changes
  useEffect(() => {
    console.log('[LayoutWrapper] Location changed to:', location.pathname);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen w-full m-0 p-0">
      <Header />
      <main className="flex-1 w-full">
        <Outlet key={location.pathname} />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
