/**
 * URL Helper utilities for AdmissionBuddy
 * Generates SEO-friendly URLs following the pattern:
 * - /india-colleges, /india-schools, /india-universities
 * - /{state}-colleges, /{state}-schools, /{state}-universities
 * - /{city}-colleges, /{city}-schools, /{city}-universities
 * - /college/{id}-{slug}, /university/{id}-{slug}, /school/{id}-{slug}
 * - /{stream}, /{stream}/{sub-stream}, /{stream}/{location}
 */

import { generateSlug } from './slugify';

// Institution type suffixes
export const INSTITUTION_TYPES = {
  COLLEGE: 'colleges',
  SCHOOL: 'schools',
  UNIVERSITY: 'universities'
};

// Generate institution listing URL
export const getInstitutionListingUrl = (type, location = null) => {
  const suffix = INSTITUTION_TYPES[type.toUpperCase()] || 'colleges';
  
  if (!location) {
    return `/india-${suffix}`;
  }
  
  const locationSlug = generateSlug(location);
  return `/${locationSlug}-${suffix}`;
};

// Generate institution detail URL
// Format: /college/{number}-{slug} e.g., /college/001-mr-college-of-pharmacy
export const getInstitutionDetailUrl = (type, id, name) => {
  const typeSlug = type?.toLowerCase() || 'college';
  const nameSlug = generateSlug(name);
  // Extract numeric part from ID if it exists (e.g., "001" from "iit-delhi-001")
  const idMatch = id?.match(/(\d+)$/);
  const numericId = idMatch ? idMatch[1] : id?.replace(/-/g, '') || '';
  // Format: {number}-{slug} with dash between
  return `/${typeSlug}/${numericId}-${nameSlug}`;
};

// Generate stream-based listing URL
export const getStreamListingUrl = (stream, subStream = null, location = null) => {
  const streamSlug = generateSlug(stream);
  
  if (!subStream && !location) {
    return `/${streamSlug}`;
  }
  
  if (subStream && !location) {
    const subStreamSlug = generateSlug(subStream);
    return `/${streamSlug}/${subStreamSlug}`;
  }
  
  if (!subStream && location) {
    const locationSlug = generateSlug(location);
    return `/${streamSlug}/${locationSlug}`;
  }
  
  // All three: stream + sub-stream + location
  const subStreamSlug = generateSlug(subStream);
  const locationSlug = generateSlug(location);
  return `/${streamSlug}/${subStreamSlug}/${locationSlug}`;
};

// Generate course URL
export const getCourseListingUrl = (stream = null, subStream = null) => {
  if (!stream) {
    return '/courses';
  }
  
  const streamSlug = generateSlug(stream);
  
  if (!subStream) {
    return `/courses/${streamSlug}`;
  }
  
  const subStreamSlug = generateSlug(subStream);
  return `/courses/${subStreamSlug}`;
};

// Generate course detail URL
export const getCourseDetailUrl = (id, name) => {
  const nameSlug = generateSlug(name);
  return `/courses/${id}-${nameSlug}`;
};

// Generate exam URL
export const getExamListingUrl = () => '/exams';

export const getExamDetailUrl = (examSlug) => {
  return `/exams/${generateSlug(examSlug)}`;
};

// Generate news URL
export const getNewsListingUrl = () => '/news';

export const getNewsDetailUrl = (id, title) => {
  const titleSlug = generateSlug(title);
  return `/news/${id}-${titleSlug}`;
};

// Parse URL to extract parameters
export const parseListingUrl = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  
  // Check for institution listing patterns
  const institutionMatch = parts[0]?.match(/^(.+)-(colleges|schools|universities)$/);
  if (institutionMatch) {
    return {
      type: 'institution-listing',
      location: institutionMatch[1] === 'india' ? null : institutionMatch[1],
      institutionType: institutionMatch[2]
    };
  }
  
  // Check for institution detail patterns: /college/{id}-{slug}
  if (['college', 'university', 'school'].includes(parts[0])) {
    const idMatch = parts[1]?.match(/^(\d+)-(.+)$/);
    if (idMatch) {
      return {
        type: 'institution-detail',
        institutionType: parts[0],
        id: idMatch[1],
        slug: idMatch[2]
      };
    }
    // Location-based school listing: /school/west-bengal
    return {
      type: 'institution-location-listing',
      institutionType: parts[0],
      location: parts[1]
    };
  }
  
  // Check for stream-based patterns
  if (parts.length >= 1 && !['courses', 'exams', 'news'].includes(parts[0])) {
    return {
      type: 'stream-listing',
      stream: parts[0],
      subStream: parts[1] || null,
      location: parts[2] || null
    };
  }
  
  return { type: 'unknown', parts };
};

// Validate if a string is a state
export const INDIAN_STATES = [
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka',
  'kerala', 'madhya-pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
  'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu',
  'telangana', 'tripura', 'uttar-pradesh', 'uttarakhand', 'west-bengal',
  'delhi', 'jammu-kashmir', 'ladakh', 'chandigarh', 'puducherry',
  'andaman-nicobar', 'dadra-nagar-haveli', 'daman-diu', 'lakshadweep'
];

export const isState = (slug) => INDIAN_STATES.includes(slug?.toLowerCase());

// Common Indian cities
export const INDIAN_CITIES = [
  'mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune',
  'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane',
  'bhopal', 'visakhapatnam', 'patna', 'vadodara', 'ghaziabad', 'ludhiana',
  'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar',
  'aurangabad', 'dhanbad', 'amritsar', 'allahabad', 'ranchi', 'howrah',
  'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai',
  'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli', 'mysore',
  'tiruchirappalli', 'bareilly', 'aligarh', 'tiruppur', 'moradabad', 'jalandhar',
  'bhubaneswar', 'salem', 'warangal', 'guntur', 'bhiwandi', 'saharanpur',
  'gorakhpur', 'bikaner', 'amravati', 'noida', 'jamshedpur', 'bhilai',
  'cuttack', 'firozabad', 'kochi', 'nellore', 'bhavnagar', 'dehradun',
  'durgapur', 'asansol', 'rourkela', 'nanded', 'kolhapur', 'ajmer',
  'akola', 'gulbarga', 'jamnagar', 'ujjain', 'loni', 'siliguri', 'jhansi',
  'ulhasnagar', 'jammu', 'sangli', 'mangalore', 'erode', 'belgaum',
  'kurnool', 'ambattur', 'rajahmundry', 'tirunelveli', 'malegaon', 'gaya'
];

export const isCity = (slug) => INDIAN_CITIES.includes(slug?.toLowerCase());

export default {
  generateSlug,
  getInstitutionListingUrl,
  getInstitutionDetailUrl,
  getStreamListingUrl,
  getCourseListingUrl,
  getCourseDetailUrl,
  getExamListingUrl,
  getExamDetailUrl,
  getNewsListingUrl,
  getNewsDetailUrl,
  parseListingUrl,
  isState,
  isCity,
  INSTITUTION_TYPES,
  INDIAN_STATES,
  INDIAN_CITIES
};
