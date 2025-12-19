import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ApplyNowModal from './ApplyNowModal';
import { useAuth } from '../contexts/AuthContext';
import { useCollegeContext } from '../contexts/CollegeContext';

/**
 * AutoApplyPopup - Automatically shows Apply Now form after 5 seconds
 * 
 * Behavior:
 * - GUEST users on GENERAL pages: Popup shows on every page after 5 seconds
 * - GUEST users on COLLEGE/SCHOOL pages: Popup shows once per page (not again after closing until page change)
 * - REGISTERED/SUBMITTED users: Popup shows only ONCE per session
 * 
 * - On college/school/university detail pages: shows college-specific form with college name and courses
 * - On other pages: shows general form
 * 
 * Uses CollegeContext to get college data (name, logo, courses) from CollegeDetailPage
 * instead of scraping from DOM.
 */
const AutoApplyPopup = () => {
  const [showModal, setShowModal] = useState(false);
  const [popupClosedOnPage, setPopupClosedOnPage] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { currentCollege } = useCollegeContext();
  const timerRef = useRef(null);
  const currentPathRef = useRef(location.pathname);
  
  // Check if we're on a college/school/university detail page
  const isCollegePage = location.pathname.match(/^\/(colleges|schools|universities)\/[^/]+$/);
  
  // Skip popup on admin pages and auth pages
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = ['/signup', '/login', '/register', '/auth/callback', '/dashboard', '/institute'].some(
    path => location.pathname.startsWith(path)
  );
  
  // Extract the slug from URL if on detail page (fallback for when context isn't available)
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

    // Don't show popup on admin pages or auth pages
    if (isAdminPage || isAuthPage) {
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
    timerRef.current = setTimeout(() => {
      // For REGISTERED/SUBMITTED users: Mark popup as shown IMMEDIATELY
      if (isRegisteredOrSubmitted()) {
        sessionStorage.setItem('applyPopupShown', 'true');
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

  // Get college data from context or fallback to slug parsing
  const getCollegeData = () => {
    if (isCollegePage) {
      // Use context data if available (preferred - has courses)
      if (currentCollege) {
        return {
          id: currentCollege.id,
          name: currentCollege.name,
          logo_url: currentCollege.logo_url,
          courses: currentCollege.courses || []
        };
      }
      
      // Fallback: Extract name from URL slug (no courses available)
      const slug = getSlugFromPath();
      if (slug) {
        const nameFromSlug = slug
          .replace(/^\d+-/, '')
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return {
          id: null,
          name: nameFromSlug,
          logo_url: null,
          courses: []
        };
      }
    }
    return null;
  };

  const collegeData = getCollegeData();

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
