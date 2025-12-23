import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DynamicListingPage from './DynamicListingPage';
import InstitutionDetailPage from './InstitutionDetailPage';
import CollegeSubPage from './CollegeSubPage';
import api from '../api/axios';

/**
 * Smart router component that determines whether to show a listing page, detail page, or sub-page
 * based on the URL pattern.
 * 
 * URL Format:
 * - Detail pages with numeric prefix: /colleges/001-iit-bombay (numeric prefix followed by hyphen)
 * - Detail pages with slug only: /colleges/iit-bombay (slug without numeric prefix)
 * - Sub-pages: /colleges/001-iit-bombay/courses or /colleges/iit-bombay/courses
 * - Listing pages: /colleges/west-bengal, /colleges/engineering, etc. (known listing patterns)
 * - University/School detail: /university/jnu-delhi, /schools/dps-delhi
 */

// Known sub-page sections - these are detail page tabs
const SUB_PAGE_SECTIONS = [
  'info', 'courses', 'admission', 'cutoff', 'placement', 'ranking', 'scholarship',
  'facilities', 'gallery', 'reviews', 'location', 'hostel', 'fees', 'overview'
];

// Static fallback listing patterns (used while API loads or if API fails)
const STATIC_LISTING_PATTERNS = [
  // States
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat',
  'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh',
  'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
  'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura', 'uttar-pradesh',
  'uttarakhand', 'west-bengal', 'delhi', 'jammu-kashmir', 'jammu-and-kashmir', 'ladakh',
  'andaman-and-nicobar-islands', 'chandigarh', 'dadra-and-nagar-haveli', 'daman-and-diu',
  'lakshadweep', 'puducherry',
  // Streams
  'engineering', 'engineering-and-technology', 'medical', 'medical-and-health-sciences',
  'management', 'management-and-business', 'law', 'arts', 'arts-and-humanities',
  'science', 'commerce', 'computer-applications', 'education', 'architecture',
  'architecture-and-planning', 'agriculture', 'design', 'pharmacy', 'dental', 'nursing',
  'hotel-management', 'mass-communication', 'aviation',
  // Common courses (short forms)
  'btech', 'be', 'mtech', 'me', 'mba', 'bba', 'bcom', 'mcom', 'ba', 'ma', 'bsc', 'msc',
  'bca', 'mca', 'llb', 'llm', 'mbbs', 'bds', 'bpharm', 'mpharm', 'bed', 'med',
  'barch', 'march', 'bdes', 'mdes', 'bhm', 'mhm', 'bjmc', 'mjmc',
  // College types
  'private', 'government', 'deemed', 'autonomous', 'aided', 'public',
  // Special keywords
  'top', 'best', 'ranking', 'fees', 'admission'
];

// Cache for dynamic patterns
let cachedListingPatterns = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const InstitutionRouter = () => {
  const { seg1, seg2 } = useParams();
  const location = useLocation();
  const [listingPatterns, setListingPatterns] = useState(STATIC_LISTING_PATTERNS);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch listing patterns from API (states, cities, streams, courses)
  useEffect(() => {
    const fetchListingPatterns = async () => {
      // Check cache first
      if (cachedListingPatterns && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setListingPatterns(cachedListingPatterns);
        setIsLoading(false);
        return;
      }

      try {
        const [statesRes, citiesRes, streamsRes, coursesRes] = await Promise.all([
          api.get('/locations/all-states'),
          api.get('/locations/all-cities'),
          api.get('/streams'),
          api.get('/courses?limit=500')
        ]);

        const patterns = new Set(STATIC_LISTING_PATTERNS);

        // Add state slugs
        (statesRes.data || []).forEach(s => {
          if (s.slug) patterns.add(s.slug.toLowerCase());
          if (s.name) patterns.add(s.name.toLowerCase().replace(/\s+/g, '-'));
        });

        // Add city slugs
        (citiesRes.data || []).forEach(c => {
          if (c.slug) patterns.add(c.slug.toLowerCase());
          if (c.name) patterns.add(c.name.toLowerCase().replace(/\s+/g, '-'));
        });

        // Add stream slugs
        (streamsRes.data || []).forEach(s => {
          if (s.slug) patterns.add(s.slug.toLowerCase());
          if (s.name) patterns.add(s.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'));
        });

        // Add course slugs
        (coursesRes.data || []).forEach(c => {
          if (c.slug) patterns.add(c.slug.toLowerCase());
          if (c.name) patterns.add(c.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''));
        });

        const patternsArray = Array.from(patterns);
        cachedListingPatterns = patternsArray;
        cacheTimestamp = Date.now();
        setListingPatterns(patternsArray);
      } catch (error) {
        console.error('Error fetching listing patterns:', error);
        // Keep using static patterns on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingPatterns();
  }, []);

  // Helper function to check if a slug is a listing pattern
  const isListingSlug = (slug) => {
    if (!slug) return false;
    const normalizedSlug = slug.toLowerCase();
    return listingPatterns.some(pattern => normalizedSlug === pattern);
  };

  // Check if this is a university or school route (handle both singular and plural)
  const isUniversityRoute = location.pathname.startsWith('/university/') || location.pathname.startsWith('/universities/');
  const isSchoolRoute = location.pathname.startsWith('/schools/') || location.pathname.startsWith('/school/');
  const isNonCollegeRoute = isUniversityRoute || isSchoolRoute;
  
  // Check if seg1 looks like a detail page ID (starts with numbers followed by hyphen)
  // Examples: "001-iit-bombay", "1-college-name", "123-some-college"
  const isNumericPrefixId = seg1 && /^\d+-/.test(seg1);
  
  // Check if seg1 is a known listing pattern (exact match only)
  const isListingPattern = isListingSlug(seg1);
  
  // Check if seg2 is a known sub-page section
  const isSubPageSection = seg2 && SUB_PAGE_SECTIONS.includes(seg2.toLowerCase());
  
  // Check if seg2 is ALSO a listing pattern (for combined listings like /colleges/maharashtra/engineering)
  const isSeg2ListingPattern = isListingSlug(seg2);

  // Show loading state briefly while patterns load
  if (isLoading && !cachedListingPatterns) {
    // Use static patterns for immediate routing decision
  }

  // ROUTING LOGIC:
  
  // 1. If seg1 has numeric prefix, it's ALWAYS a detail page (e.g., 001-iit-bombay)
  if (isNumericPrefixId) {
    if (seg2 && isSubPageSection) {
      return <CollegeSubPage />;
    }
    if (seg2 && isSeg2ListingPattern) {
      // This shouldn't happen, but handle gracefully
      return <DynamicListingPage />;
    }
    return <InstitutionDetailPage />;
  }

  // 2. If seg1 is a listing pattern
  if (isListingPattern) {
    // If seg2 is also a listing pattern, it's a combined listing page (e.g., /colleges/maharashtra/engineering)
    if (seg2 && isSeg2ListingPattern) {
      return <DynamicListingPage />;
    }
    // If seg2 is a sub-page section, this is invalid - treat as listing
    if (seg2 && isSubPageSection) {
      return <DynamicListingPage />;
    }
    // If no seg2, it's a simple listing page (e.g., /colleges/maharashtra)
    if (!seg2) {
      return <DynamicListingPage />;
    }
    // seg2 exists but isn't a listing or sub-page pattern - treat seg2 as detail slug
    // This handles edge cases
    return <DynamicListingPage />;
  }

  // 3. For non-college routes (university/school), if seg1 is NOT a listing pattern, it's a detail page
  if (isNonCollegeRoute && seg1 && !isListingPattern) {
    if (seg2 && isSubPageSection) {
      return <CollegeSubPage />;
    }
    return <InstitutionDetailPage />;
  }

  // 4. For college routes, if seg1 is NOT a listing pattern, it's likely a detail page slug
  if (seg1 && !isListingPattern) {
    if (seg2 && isSubPageSection) {
      return <CollegeSubPage />;
    }
    if (seg2 && isSeg2ListingPattern) {
      // e.g., /colleges/some-college/engineering - ambiguous, but likely sub-listing
      return <DynamicListingPage />;
    }
    // No seg2, and seg1 is not a listing pattern - it's a detail page
    return <InstitutionDetailPage />;
  }

  // 5. Default to listing page
  return <DynamicListingPage />;
};

export default InstitutionRouter;
