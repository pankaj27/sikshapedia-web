import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ApplyNowModal from './ApplyNowModal';

/**
 * SimpleAutoPopup - Shows Apply Now popup only on homepage, once per session
 */
const SimpleAutoPopup = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  
  // Only show popup on homepage, once per session
  useEffect(() => {
    // Only show on homepage
    if (location.pathname !== '/') {
      return;
    }
    
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('popupShown');
    if (alreadyShown) {
      return;
    }
    
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setShowModal(true);
      sessionStorage.setItem('popupShown', 'true');
    }, 3000); // 3 second delay
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  const handleClose = () => {
    setShowModal(false);
  };
  
  // Don't render anything if not on homepage
  if (location.pathname !== '/') {
    return null;
  }
  
  return (
    <ApplyNowModal
      isOpen={showModal}
      onClose={handleClose}
      source="homepage_popup"
    />
  );
};

export default SimpleAutoPopup;
