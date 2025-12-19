import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ApplyNowModal from './ApplyNowModal';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

/**
 * AutoApplyPopup - Automatically shows Apply Now form after 5 seconds
 * 
 * Behavior:
 * - GUEST users: Popup shows on EVERY page after 5 seconds
 * - REGISTERED users: Popup shows only ONCE per session
 * 
 * - On college/school/university detail pages: shows college-specific form
 * - On other pages: shows general form
 */
const AutoApplyPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [collegeData, setCollegeData] = useState(null);
  const location = useLocation();
  const { user } = useAuth();  // Check if user is logged in
  const timerRef = useRef(null);
  
  // Check if we're on a college/school/university detail page
  const isCollegePage = location.pathname.match(/^\/(colleges|schools|universities)\/[^/]+$/);
  
  // Skip popup on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Extract the slug from URL if on detail page
  const getSlugFromPath = () => {
    const match = location.pathname.match(/^\/(colleges|schools|universities)\/(.+)$/);
    return match ? match[2] : null;
  };

  // Check if user is logged in (check localStorage directly for reliability)
  const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    return !!(token && savedUser);
  };

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Don't show popup on admin pages
    if (isAdminPage) {
      return;
    }

    // For REGISTERED users: Check if popup was already shown in this session
    if (isLoggedIn()) {
      const popupShown = sessionStorage.getItem('applyPopupShown');
      if (popupShown) {
        return; // Don't show popup again for logged-in users
      }
    }

    // Set timer for 5 seconds
    timerRef.current = setTimeout(async () => {
      // For REGISTERED users: Mark popup as shown IMMEDIATELY
      // This prevents popup from showing on subsequent pages during navigation
      if (isLoggedIn()) {
        sessionStorage.setItem('applyPopupShown', 'true');
      }

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
    }, 5000); // 5 seconds

    // Cleanup timer on unmount or location change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [location.pathname, isCollegePage, isAdminPage]);

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
      formHeading={collegeData?.name ? `Apply to ${collegeData.name}` : null}
      source={isCollegePage ? 'auto_popup_college' : 'auto_popup_general'}
    />
  );
};

export default AutoApplyPopup;
