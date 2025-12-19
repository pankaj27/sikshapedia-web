import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ApplyNowModal from './ApplyNowModal';
import api from '../api/axios';

/**
 * AutoApplyPopup - Automatically shows Apply Now form after 5 seconds
 * - Shows only once per session (using sessionStorage)
 * - On college/school/university detail pages: shows college-specific form
 * - On other pages: shows general form
 */
const AutoApplyPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [collegeData, setCollegeData] = useState(null);
  const location = useLocation();
  
  // Check if we're on a college/school/university detail page
  const isCollegePage = location.pathname.match(/^\/(colleges|schools|universities)\/[^/]+$/);
  
  // Extract the slug from URL if on detail page
  const getSlugFromPath = () => {
    const match = location.pathname.match(/^\/(colleges|schools|universities)\/(.+)$/);
    return match ? match[2] : null;
  };

  useEffect(() => {
    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('applyPopupShown');
    
    if (popupShown) {
      return; // Don't show popup again
    }

    // Set timer for 5 seconds
    const timer = setTimeout(async () => {
      // If on college detail page, fetch college data
      if (isCollegePage) {
        const slug = getSlugFromPath();
        if (slug) {
          try {
            const response = await api.get(`/colleges/by-slug/${slug}`);
            if (response.data) {
              setCollegeData({
                id: response.data.id,
                name: response.data.name,
                logo_url: response.data.logo_url,
                courses: response.data.courses?.map(c => typeof c === 'object' ? c.name : c) || []
              });
            }
          } catch (err) {
            console.error('Failed to fetch college for popup:', err);
          }
        }
      }
      
      // Show the modal
      setShowModal(true);
      
      // Mark popup as shown for this session
      sessionStorage.setItem('applyPopupShown', 'true');
    }, 5000); // 5 seconds

    // Cleanup timer on unmount or location change
    return () => clearTimeout(timer);
  }, [location.pathname, isCollegePage]);

  const handleClose = () => {
    setShowModal(false);
    setCollegeData(null);
  };

  return (
    <ApplyNowModal
      isOpen={showModal}
      onClose={handleClose}
      collegeId={collegeData?.id || null}
      collegeName={collegeData?.name || null}
      collegeLogoUrl={collegeData?.logo_url || null}
      collegeCourses={collegeData?.courses || []}
      source={isCollegePage ? 'auto_popup_college' : 'auto_popup_general'}
    />
  );
};

export default AutoApplyPopup;
