import React, { useEffect, useRef, memo } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';

/**
 * LayoutWrapper - A wrapper component for React Router v6/v7 nested routes
 * Uses pathname as key to force re-mount on navigation
 */
const LayoutWrapper = memo(() => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  
  // Log navigation (without causing re-renders)
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      console.log('[LayoutWrapper] Navigated from', prevPathRef.current, 'to', location.pathname);
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen w-full m-0 p-0">
      <Header key="header" />
      <main className="flex-1 w-full">
        <Outlet key={location.pathname + location.search} />
      </main>
      <Footer key="footer" />
    </div>
  );
});

LayoutWrapper.displayName = 'LayoutWrapper';

export default LayoutWrapper;
