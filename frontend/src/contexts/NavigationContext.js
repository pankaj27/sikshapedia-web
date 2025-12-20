import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * NavigationContext - Forces React components to re-render on navigation
 * This is a workaround for React Router v7 navigation issues caused by
 * external scripts interfering with React's state updates.
 */
const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const [navigationKey, setNavigationKey] = useState(0);
  
  // Force re-render when location changes
  useEffect(() => {
    setNavigationKey(prev => prev + 1);
  }, [location.pathname, location.search, location.hash]);
  
  const value = useMemo(() => ({
    navigationKey,
    currentPath: location.pathname
  }), [navigationKey, location.pathname]);
  
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    return { navigationKey: 0, currentPath: '/' };
  }
  return context;
};

export default NavigationContext;
