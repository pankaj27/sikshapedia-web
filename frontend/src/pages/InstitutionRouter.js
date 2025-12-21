import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DynamicListingPage from './DynamicListingPage';
import InstitutionDetailPage from './InstitutionDetailPage';
import CollegeSubPage from './CollegeSubPage';
import { isState, isCity, isStream, isCourse } from '../utils/urlHelpers';

/**
 * Smart router component that determines whether to show a listing page, detail page, or sub-page
 * based on the URL pattern.
 * 
 * Logic:
 * - If seg1 is a known filter (state, city, stream, course), it's a listing page
 * - If seg1 is NOT a known filter, it's a detail page (institution ID or slug)
 * - If seg1 is a detail page ID and seg2 exists, it's a sub-page (e.g., /colleges/iit-bombay-002/courses)
 * 
 * Examples:
 * - /colleges/west-bengal -> Listing page (west-bengal is a state)
 * - /colleges/engineering -> Listing page (engineering is a stream)  
 * - /colleges/iit-bombay-002 -> Detail page (not a known filter)
 * - /colleges/ff787707-1dcb-4b24-86df-4229604fbae4 -> Detail page (UUID)
 * - /colleges/iit-bombay-002/courses -> Sub-page
 */
const InstitutionRouter = () => {
  const { seg1, seg2 } = useParams();
  const location = useLocation();
  
  // Check if seg1 is a known listing filter (state, city, stream, or course)
  const isKnownFilter = seg1 && (isState(seg1) || isCity(seg1) || isStream(seg1) || isCourse(seg1));
  
  // If seg1 is a known filter, this is a listing page
  if (isKnownFilter) {
    return <DynamicListingPage />;
  }
  
  // seg1 is NOT a known filter, so it must be an institution ID/slug (detail page)
  if (seg1) {
    // If there's a seg2, it's a sub-page (like /colleges/iit-bombay-002/courses)
    if (seg2) {
      // Check if seg2 is a known sub-page section
      const knownSections = ['courses', 'fees', 'admissions', 'placements', 'reviews', 'gallery', 'hostel', 'faculty'];
      if (knownSections.includes(seg2.toLowerCase())) {
        return <CollegeSubPage />;
      }
      // seg2 is also not a section - could be a 2-filter listing page
      // e.g., /colleges/west-bengal/engineering (but isKnownFilter would have caught this)
      return <CollegeSubPage />;
    }
    // No seg2, it's a detail page
    return <InstitutionDetailPage />;
  }
  
  // Fallback to listing page
  return <DynamicListingPage />;
};

export default InstitutionRouter;
