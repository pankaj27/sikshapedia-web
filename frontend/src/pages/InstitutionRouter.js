import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DynamicListingPage from './DynamicListingPage';
import InstitutionDetailPage from './InstitutionDetailPage';
import CollegeSubPage from './CollegeSubPage';
import UniversityDetailPage from './UniversityDetailPage';

/**
 * Smart router component that determines whether to show a listing page, detail page, or sub-page
 * based on the URL pattern.
 * 
 * URL Format:
 * - Detail pages: /colleges/001-iit-bombay (numeric prefix followed by hyphen)
 * - Sub-pages: /colleges/001-iit-bombay/courses (detail page + section)
 * - Listing pages: /colleges/west-bengal, /colleges/engineering, etc.
 * - University detail: /universities/jnu-delhi (slug without numeric prefix)
 */
const InstitutionRouter = () => {
  const { seg1, seg2 } = useParams();
  const location = useLocation();
  
  // Check if this is a universities route (they use slug without numeric prefix)
  const isUniversitiesRoute = location.pathname.startsWith('/universities/');
  
  // Check if seg1 looks like a detail page ID (starts with numbers followed by hyphen)
  // Examples: "001-iit-bombay", "1-college-name", "123-some-college"
  const isDetailPageId = seg1 && /^\d+-/.test(seg1);
  
  // For universities, any slug is a potential detail page
  if (isUniversitiesRoute && seg1) {
    return <UniversityDetailPage />;
  }
  
  if (isDetailPageId) {
    // If there's a seg2, it's a sub-page (like /colleges/001-iit-bombay/courses)
    if (seg2) {
      return <CollegeSubPage />;
    }
    // Otherwise it's a detail page
    return <InstitutionDetailPage />;
  }
  
  // Not a detail page - render listing page
  return <DynamicListingPage />;
};

export default InstitutionRouter;
