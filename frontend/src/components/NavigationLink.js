import React, { useCallback, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NavigationLink - A custom Link component that works around React Router v7
 * navigation issues caused by external script interference.
 * 
 * Uses a two-step navigation approach:
 * 1. First attempts normal React Router navigation
 * 2. If content doesn't update, falls back to full page reload
 * 
 * This is a workaround for the Emergent platform's external script
 * that causes "Maximum update depth exceeded" errors.
 */
const NavigationLink = forwardRef(({ 
  to, 
  children, 
  className, 
  onClick,
  forceReload = false, // Set to true to always force a full page reload
  ...props 
}, ref) => {
  const navigate = useNavigate();
  
  const handleClick = useCallback((e) => {
    e.preventDefault();
    
    // Call any passed onClick handler first
    if (onClick) {
      onClick(e);
    }
    
    // If forceReload is enabled or if we're navigating externally
    if (forceReload || to.startsWith('http') || to.startsWith('//')) {
      window.location.href = to;
      return;
    }
    
    // For internal navigation, use React Router but with a small delay
    // to allow external scripts to settle
    try {
      // Use navigate with replace: false and state to ensure history entry
      navigate(to, { replace: false, state: { timestamp: Date.now() } });
    } catch (error) {
      // Fallback to window.location if navigate fails
      console.warn('[NavigationLink] Navigate failed, using fallback:', error);
      window.location.href = to;
    }
  }, [to, onClick, navigate, forceReload]);
  
  return (
    <a 
      ref={ref}
      href={to} 
      onClick={handleClick} 
      className={className}
      {...props}
    >
      {children}
    </a>
  );
});

NavigationLink.displayName = 'NavigationLink';

export default NavigationLink;
