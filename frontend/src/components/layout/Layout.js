import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen w-full m-0 p-0">
      <Header />
      <main className="flex-1 w-full" key={location.pathname}>
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
