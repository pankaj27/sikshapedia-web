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
// Format: /colleges/{number}-{slug}-{city} e.g., /colleges/017-mr-college-of-pharmacy-barasat
// If city is already in name, it won't be duplicated
// serialNumber is the unique sequential number from the database
export const getInstitutionDetailUrl = (type, id, name, city = null, serialNumber = null) => {
  // Use plural form for detail pages: colleges, universities, schools
  const typeSuffix = INSTITUTION_TYPES[type?.toUpperCase()] || 'colleges';
  const nameSlug = generateSlug(name);
  
  // Use serial_number if provided, otherwise fallback to extracting from ID
  let numericId;
  if (serialNumber) {
    // Pad to 3 digits: 1 -> "001", 12 -> "012", 123 -> "123"
    numericId = String(serialNumber).padStart(3, '0');
  } else {
    // Fallback: extract numeric part from ID (e.g., "001" from "iit-delhi-001")
    const idMatch = id?.match(/(\d+)$/);
    numericId = idMatch ? idMatch[1] : '000';
  }
  
  // Check if city needs to be appended
  let finalSlug = nameSlug;
  if (city) {
    const citySlug = generateSlug(city);
    // Get the main city name (handle "New Delhi" -> "delhi", "Mumbai" -> "mumbai")
    const mainCityPart = citySlug.split('-').pop(); // Get last part: "new-delhi" -> "delhi"
    
    // Only append city if city name (or main part) is not already in the name slug
    const nameHasCity = nameSlug.toLowerCase().includes(citySlug.toLowerCase()) || 
                        nameSlug.toLowerCase().includes(mainCityPart.toLowerCase());
    
    if (!nameHasCity) {
      finalSlug = `${nameSlug}-${citySlug}`;
    }
  }
  
  // Format: /colleges/{number}-{slug} or /colleges/{number}-{slug}-{city}
  return `/${typeSuffix}/${numericId}-${finalSlug}`;
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

// College Types for URL parsing
export const COLLEGE_TYPES = ['government', 'private', 'deemed', 'autonomous', 'public-private', 'aided'];

// Accreditation grades for URL parsing
export const ACCREDITATION_GRADES = [
  'naac-a-plus-plus', 'naac-a-plus', 'naac-a', 'naac-b-plus-plus', 'naac-b-plus', 'naac-b', 'naac-c',
  'nba-accredited', 'nirf-ranked'
];

// Check if slug is a college type
export const isCollegeType = (slug) => COLLEGE_TYPES.includes(slug?.toLowerCase());

// Check if slug is an accreditation grade
export const isAccreditation = (slug) => ACCREDITATION_GRADES.includes(slug?.toLowerCase());

// Parse URL to extract parameters
export const parseListingUrl = (pathname, searchParams = '') => {
  const parts = pathname.split('/').filter(Boolean);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(searchParams);
  const queryFilters = {
    course: queryParams.get('course') || null,
    degreeType: queryParams.get('degree') || null,
    examAccepted: queryParams.get('exam') || null,
    affiliation: queryParams.get('affiliation') || null,
    recognition: queryParams.get('recognition') || null,
  };
  
  // Check for institution listing patterns: /{location}-colleges or /{type}-colleges or /{accreditation}-colleges
  const institutionMatch = parts[0]?.match(/^(.+)-(colleges|schools|universities)$/);
  if (institutionMatch && parts.length === 1) {
    const prefix = institutionMatch[1];
    const institutionType = institutionMatch[2];
    
    // Check if it's a college type filter (e.g., government-colleges)
    if (isCollegeType(prefix)) {
      return {
        type: 'institution-listing',
        location: null,
        institutionType: institutionType,
        collegeType: prefix,
        combinedFilters: { collegeType: prefix },
        queryFilters
      };
    }
    
    // Check if it's an accreditation filter (e.g., naac-a-plus-colleges)
    if (isAccreditation(prefix)) {
      return {
        type: 'institution-listing',
        location: null,
        institutionType: institutionType,
        accreditation: prefix,
        combinedFilters: { accreditation: prefix },
        queryFilters
      };
    }
    
    return {
      type: 'institution-listing',
      location: prefix === 'india' ? null : prefix,
      institutionType: institutionType,
      queryFilters
    };
  }
  
  // Check for combined patterns with 2 parts: /engineering/maharashtra-colleges, /maharashtra/mumbai-colleges
  // or /government/maharashtra-colleges, /naac-a-plus/engineering-colleges
  if (parts.length === 2) {
    const secondPartMatch = parts[1]?.match(/^(.+)-(colleges|schools|universities)$/);
    if (secondPartMatch) {
      const firstPart = parts[0];
      const secondPart = secondPartMatch[1];
      const institutionType = secondPartMatch[2];
      
      // Check if first part is a state (for state/city combination)
      if (isState(firstPart)) {
        return {
          type: 'institution-listing',
          state: firstPart,
          location: secondPart, // city
          institutionType: institutionType,
          combinedFilters: { state: firstPart, city: secondPart },
          queryFilters
        };
      }
      
      // Check if first part is a college type (e.g., /government/maharashtra-colleges)
      if (isCollegeType(firstPart)) {
        // Second part could be state, city, or stream
        if (isState(secondPart)) {
          return {
            type: 'institution-listing',
            state: secondPart,
            institutionType: institutionType,
            collegeType: firstPart,
            combinedFilters: { collegeType: firstPart, state: secondPart },
            queryFilters
          };
        }
        return {
          type: 'institution-listing',
          location: secondPart,
          institutionType: institutionType,
          collegeType: firstPart,
          combinedFilters: { collegeType: firstPart, location: secondPart },
          queryFilters
        };
      }
      
      // Check if first part is accreditation (e.g., /naac-a-plus/maharashtra-colleges)
      if (isAccreditation(firstPart)) {
        if (isState(secondPart)) {
          return {
            type: 'institution-listing',
            state: secondPart,
            institutionType: institutionType,
            accreditation: firstPart,
            combinedFilters: { accreditation: firstPart, state: secondPart },
            queryFilters
          };
        }
        return {
          type: 'institution-listing',
          location: secondPart,
          institutionType: institutionType,
          accreditation: firstPart,
          combinedFilters: { accreditation: firstPart, location: secondPart },
          queryFilters
        };
      }
      
      // Otherwise it's stream/location combination
      return {
        type: 'stream-listing',
        stream: firstPart,
        location: secondPart,
        institutionType: institutionType,
        combinedFilters: { stream: firstPart, location: secondPart },
        queryFilters
      };
    }
  }
  
  // Check for institution detail patterns: /colleges/{id}-{slug}
  if (['colleges', 'universities', 'schools'].includes(parts[0])) {
    const idMatch = parts[1]?.match(/^(\d+)-(.+)$/);
    if (idMatch) {
      return {
        type: 'institution-detail',
        institutionType: parts[0],
        id: idMatch[1],
        slug: idMatch[2]
      };
    }
    // Location-based listing: /colleges/west-bengal (shouldn't happen with new structure)
    return {
      type: 'institution-location-listing',
      institutionType: parts[0].replace(/s$/, ''), // Remove trailing 's'
      location: parts[1]
    };
  }
  
  // Check for stream-based patterns: /engineering, /engineering/computer-science
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
