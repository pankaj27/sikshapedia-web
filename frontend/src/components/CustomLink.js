/**
 * CustomLink - A replacement for React Router's Link component
 * 
 * This component uses window.location.href for navigation to work around
 * an issue with React Router v7 where external scripts cause infinite
 * render loops that prevent client-side navigation from updating page content.
 * 
 * Usage: Replace `import { Link } from 'react-router-dom'` with
 *        `import { Link } from '../components/CustomLink'`
 */
import React, { useCallback, forwardRef } from 'react';

export const Link = forwardRef(({ to, children, className, onClick, target, rel, ...props }, ref) => {
  const handleClick = useCallback((e) => {
    // Allow default behavior for new tab links
    if (target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }
    
    // Allow external links to work normally
    if (to && (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('//'))) {
      return;
    }
    
    e.preventDefault();
    
    // Call any passed onClick handler
    if (onClick) {
      onClick(e);
    }
    
    // Navigate using full page reload
    if (to) {
      window.location.href = to;
    }
  }, [to, onClick, target]);
  
  return (
    <a 
      ref={ref}
      href={to} 
      onClick={handleClick} 
      className={className}
      target={target}
      rel={rel}
      {...props}
    >
      {children}
    </a>
  );
});

Link.displayName = 'Link';

// NavLink is same as Link for our purposes
export const NavLink = Link;

export default Link;
