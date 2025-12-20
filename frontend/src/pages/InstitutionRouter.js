import React from 'react';
import { useParams } from 'react-router-dom';
import DynamicListingPage from './DynamicListingPage';
import InstitutionDetailPage from './InstitutionDetailPage';

/**
 * Smart router component that determines whether to show a listing page or detail page
 * based on the URL pattern.
 * 
 * Detail pages: /colleges/001-iit-bombay (numeric prefix followed by hyphen)
 * Listing pages: /colleges/west-bengal, /colleges/engineering, etc.
 */
const InstitutionRouter = () => {
  const { seg1 } = useParams();
  
  // Check if seg1 looks like a detail page ID (starts with numbers followed by hyphen)
  // Examples: "001-iit-bombay", "1-college-name", "123-some-college"
  const isDetailPage = seg1 && /^\d+-/.test(seg1);
  
  if (isDetailPage) {
    // Render detail page - pass seg1 as idSlug
    return <InstitutionDetailPage />;
  }
  
  // Render listing page
  return <DynamicListingPage />;
};

export default InstitutionRouter;
