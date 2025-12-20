import React, { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';

/**
 * LayoutWrapper - A wrapper component that uses useOutlet to properly
 * render nested routes with React Router v6
 */
const LayoutWrapper = () => {
  const location = useLocation();
  const outlet = useOutlet();
  
  // Debug: log when location changes
  useEffect(() => {
    console.log('[LayoutWrapper] Location changed to:', location.pathname);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen w-full m-0 p-0">
      <Header />
      <main className="flex-1 w-full" key={location.pathname}>
        {outlet}
      </main>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
