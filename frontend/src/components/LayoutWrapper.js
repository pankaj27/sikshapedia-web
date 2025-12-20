import React, { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';

/**
 * LayoutWrapper - A wrapper component for React Router v6/v7 nested routes
 * Uses a counter-based key to force re-mount of children on navigation
 */
const LayoutWrapper = () => {
  const location = useLocation();
  const [renderKey, setRenderKey] = useState(0);
  
  // Force re-render when location changes
  useEffect(() => {
    console.log('[LayoutWrapper] Location changed to:', location.pathname);
    // Increment key to force Outlet re-mount
    setRenderKey(prev => prev + 1);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen w-full m-0 p-0">
      <Header />
      <main className="flex-1 w-full" key={renderKey}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
