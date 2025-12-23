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
 * - Detail pages with numeric prefix: /colleges/001-iit-bombay (numeric prefix followed by hyphen)
 * - Detail pages with slug only: /colleges/iit-bombay (slug without numeric prefix)
 * - Sub-pages: /colleges/001-iit-bombay/courses or /colleges/iit-bombay/courses
 * - Listing pages: /colleges/west-bengal, /colleges/engineering, etc. (known listing patterns)
 * - University detail: /university/jnu-delhi (slug without numeric prefix)
 */

// Known listing page patterns - these should render DynamicListingPage
const LISTING_PATTERNS = [
  // States
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat',
  'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh',
  'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
  'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura', 'uttar-pradesh',
  'uttarakhand', 'west-bengal', 'delhi', 'jammu-kashmir', 'ladakh',
  // College types
  'engineering', 'medical', 'law', 'management', 'arts', 'science', 'commerce',
  'pharmacy', 'dental', 'nursing', 'education', 'agriculture', 'architecture',
  // Other common patterns
  'private', 'government', 'deemed', 'autonomous', 'top', 'best'
];

// Known sub-page sections
const SUB_PAGE_SECTIONS = [
  'info', 'courses', 'admission', 'cutoff', 'placement', 'ranking', 'scholarship',
  'facilities', 'gallery', 'reviews', 'location', 'hostel', 'fees', 'overview'
];

const InstitutionRouter = () => {
  const { seg1, seg2 } = useParams();
  const location = useLocation();
  
  // Check if this is a university route (they use slug without numeric prefix)
  const isUniversityRoute = location.pathname.startsWith('/university/');
  
  // Check if seg1 looks like a detail page ID (starts with numbers followed by hyphen)
  // Examples: "001-iit-bombay", "1-college-name", "123-some-college"
  const isNumericPrefixId = seg1 && /^\d+-/.test(seg1);
  
  // Check if seg1 is a known listing pattern
  const isListingPattern = seg1 && LISTING_PATTERNS.some(pattern => 
    seg1.toLowerCase() === pattern || seg1.toLowerCase().includes(pattern)
  );
  
  // Check if seg2 is a known sub-page section
  const isSubPageSection = seg2 && SUB_PAGE_SECTIONS.includes(seg2.toLowerCase());
  
  // For universities, any slug is a potential detail page
  if (isUniversityRoute && seg1) {
    return <UniversityDetailPage />;
  }
  
  // If it's a numeric prefix format (e.g., 001-iit-bombay)
  if (isNumericPrefixId) {
    if (seg2) {
      return <CollegeSubPage />;
    }
    return <InstitutionDetailPage />;
  }
  
  // If it's a known listing pattern, show listing page
  if (isListingPattern && !seg2) {
    return <DynamicListingPage />;
  }
  
  // If seg1 exists and seg2 is a known sub-page section, it's a sub-page
  // e.g., /colleges/iim-ahmedabad/courses
  if (seg1 && isSubPageSection) {
    return <CollegeSubPage />;
  }
  
  // If seg1 exists and is not a listing pattern, treat as detail page (slug-only format)
  // e.g., /colleges/iim-ahmedabad
  if (seg1 && !isListingPattern) {
    return <InstitutionDetailPage />;
  }
  
  // Default to listing page
  return <DynamicListingPage />;
};

export default InstitutionRouter;
