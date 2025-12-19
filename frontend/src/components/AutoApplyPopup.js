import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ApplyNowModal from './ApplyNowModal';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

/**
 * AutoApplyPopup - Automatically shows Apply Now form after 5 seconds
 * 
 * Behavior:
 * - GUEST users on GENERAL pages: Popup shows on every page after 5 seconds
 * - GUEST users on COLLEGE/SCHOOL pages: Popup shows once per page (not again after closing until page change)
 * - REGISTERED/SUBMITTED users: Popup shows only ONCE per session
 * 
 * - On college/school/university detail pages: shows college-specific form with college name
 * - On other pages: shows general form
 */
const AutoApplyPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [collegeData, setCollegeData] = useState(null);
  const [popupClosedOnPage, setPopupClosedOnPage] = useState(false);  // Track if closed on current page
  const location = useLocation();
  const { user } = useAuth();
  const timerRef = useRef(null);
  const currentPathRef = useRef(location.pathname);
  
  // Check if we're on a college/school/university detail page
  const isCollegePage = location.pathname.match(/^\/(colleges|schools|universities)\/[^/]+$/);
  
  // Skip popup on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Extract the slug from URL if on detail page
  const getSlugFromPath = () => {
    const match = location.pathname.match(/^\/(colleges|schools|universities)\/(.+)$/);
    return match ? match[2] : null;
  };

  // Check if user is logged in OR has already submitted a lead
  const isRegisteredOrSubmitted = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) return true;
    
    const hasSubmitted = localStorage.getItem('leadSubmitted');
    if (hasSubmitted) return true;
    
    return false;
  };

  // Reset popupClosedOnPage when pathname changes
  useEffect(() => {
    if (currentPathRef.current !== location.pathname) {
      setPopupClosedOnPage(false);
      currentPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Don't show popup on admin pages
    if (isAdminPage) {
      return;
    }

    // If popup was closed on this page (for college pages), don't show again
    if (popupClosedOnPage && isCollegePage) {
      return;
    }

    // For REGISTERED/SUBMITTED users: Check if popup was already shown in this session
    if (isRegisteredOrSubmitted()) {
      const popupShown = sessionStorage.getItem('applyPopupShown');
      if (popupShown) {
        return;
      }
    }

    // Set timer for 5 seconds
    timerRef.current = setTimeout(async () => {
      // For REGISTERED/SUBMITTED users: Mark popup as shown IMMEDIATELY
      if (isRegisteredOrSubmitted()) {
        sessionStorage.setItem('applyPopupShown', 'true');
      }

      // If on college/school detail page, fetch college data for college-specific popup
      if (isCollegePage) {
        const slug = getSlugFromPath();
        if (slug) {
          try {
            // Determine endpoint based on path
            const pathType = location.pathname.split('/')[1]; // 'colleges', 'schools', or 'universities'
            const response = await api.get(`/${pathType}/by-slug/${slug}`);
            if (response.data) {
              setCollegeData({
                id: response.data.id,
                name: response.data.name,
                logo_url: response.data.logo_url,
                courses: response.data.courses?.map(c => typeof c === 'object' ? c.name : c) || []
              });
            }
          } catch (err) {
            console.error('Failed to fetch institution for popup:', err);
            // Still show popup but without college-specific data
          }
        }
      } else {
        // Clear college data for general pages
        setCollegeData(null);
      }
      
      // Show the modal
      setShowModal(true);
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [location.pathname, isCollegePage, isAdminPage, popupClosedOnPage]);

  const handleClose = () => {
    setShowModal(false);
    
    // For college/school pages: mark as closed so it doesn't show again on this page
    if (isCollegePage) {
      setPopupClosedOnPage(true);
    }
  };

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
