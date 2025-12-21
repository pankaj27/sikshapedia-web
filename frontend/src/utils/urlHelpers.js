/**
 * URL Helper utilities for admissionbuddy
 * New URL Structure:
 * 
 * Universities:
 * - /university - All universities
 * - /university/{state} - Universities in state
 * - /university/{city} - Universities in city  
 * - /university/{state}/{city} - Universities in state+city
 * - /university/{stream} - Universities by stream
 * - /university/{course} - Universities by course
 * - /university/{stream}/{course} - Universities by stream+course
 * - /university/{state}/{stream} - Universities in state by stream
 * - /university/{city}/{stream} - Universities in city by stream
 * - /university/{state}/{stream}/{course} - Universities in state by stream+course
 * - /university/{city}/{stream}/{course} - Universities in city by stream+course
 * 
 * Colleges: Same pattern with /colleges
 * Schools: /schools, /schools/{state}, /schools/{city}, /schools/{state}/{city}
 */

import { generateSlug } from './slugify';

// Institution type mapping
export const INSTITUTION_TYPES = {
  COLLEGE: 'colleges',
  SCHOOL: 'schools', 
  UNIVERSITY: 'university'
};

// Indian States (slug format)
export const INDIAN_STATES = [
  'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka',
  'kerala', 'madhya-pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
  'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil-nadu',
  'telangana', 'tripura', 'uttar-pradesh', 'uttarakhand', 'west-bengal',
  'delhi', 'jammu-kashmir', 'ladakh', 'chandigarh', 'puducherry',
  'andaman-nicobar', 'dadra-nagar-haveli', 'daman-diu', 'lakshadweep'
];

// State name mapping (slug to display name)
export const STATE_NAMES = {
  'andhra-pradesh': 'Andhra Pradesh',
  'arunachal-pradesh': 'Arunachal Pradesh',
  'assam': 'Assam',
  'bihar': 'Bihar',
  'chhattisgarh': 'Chhattisgarh',
  'goa': 'Goa',
  'gujarat': 'Gujarat',
  'haryana': 'Haryana',
  'himachal-pradesh': 'Himachal Pradesh',
  'jharkhand': 'Jharkhand',
  'karnataka': 'Karnataka',
  'kerala': 'Kerala',
  'madhya-pradesh': 'Madhya Pradesh',
  'maharashtra': 'Maharashtra',
  'manipur': 'Manipur',
  'meghalaya': 'Meghalaya',
  'mizoram': 'Mizoram',
  'nagaland': 'Nagaland',
  'odisha': 'Odisha',
  'punjab': 'Punjab',
  'rajasthan': 'Rajasthan',
  'sikkim': 'Sikkim',
  'tamil-nadu': 'Tamil Nadu',
  'telangana': 'Telangana',
  'tripura': 'Tripura',
  'uttar-pradesh': 'Uttar Pradesh',
  'uttarakhand': 'Uttarakhand',
  'west-bengal': 'West Bengal',
  'delhi': 'Delhi',
  'jammu-kashmir': 'Jammu & Kashmir',
  'ladakh': 'Ladakh',
  'chandigarh': 'Chandigarh',
  'puducherry': 'Puducherry',
  'andaman-nicobar': 'Andaman & Nicobar',
  'dadra-nagar-haveli': 'Dadra & Nagar Haveli',
  'daman-diu': 'Daman & Diu',
  'lakshadweep': 'Lakshadweep'
};

// Indian Cities (slug format)
export const INDIAN_CITIES = [
  'mumbai', 'delhi', 'new-delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune',
  'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane',
  'bhopal', 'visakhapatnam', 'patna', 'vadodara', 'ghaziabad', 'ludhiana',
  'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar',
  'aurangabad', 'dhanbad', 'amritsar', 'allahabad', 'prayagraj', 'ranchi', 'howrah',
  'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai',
  'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli', 'mysore', 'mysuru',
  'tiruchirappalli', 'trichy', 'bareilly', 'aligarh', 'tiruppur', 'moradabad', 'jalandhar',
  'bhubaneswar', 'salem', 'warangal', 'guntur', 'bhiwandi', 'saharanpur',
  'gorakhpur', 'bikaner', 'amravati', 'noida', 'greater-noida', 'jamshedpur', 'bhilai',
  'cuttack', 'firozabad', 'kochi', 'cochin', 'nellore', 'bhavnagar', 'dehradun',
  'durgapur', 'asansol', 'rourkela', 'nanded', 'kolhapur', 'ajmer',
  'akola', 'gulbarga', 'jamnagar', 'ujjain', 'loni', 'siliguri', 'jhansi',
  'ulhasnagar', 'jammu', 'sangli', 'mangalore', 'mangaluru', 'erode', 'belgaum', 'belagavi',
  'kurnool', 'ambattur', 'rajahmundry', 'tirunelveli', 'malegaon', 'gaya',
  'udaipur', 'kakinada', 'davanagere', 'kozhikode', 'calicut', 'thiruvananthapuram',
  'thrissur', 'tirupati', 'rohtak', 'panipat', 'karnal', 'sonipat', 'hisar',
  'gurugram', 'gurgaon', 'shimla', 'solan', 'dharamshala', 'nainital', 'haridwar', 'rishikesh',
  'roorkee', 'haldwani', 'kharagpur', 'durgapur', 'barasat', 'kalyani', 'haldia'
];

// City name mapping (slug to display name)
export const CITY_NAMES = {
  'mumbai': 'Mumbai',
  'delhi': 'Delhi',
  'new-delhi': 'New Delhi',
  'bangalore': 'Bangalore',
  'bengaluru': 'Bengaluru',
  'hyderabad': 'Hyderabad',
  'chennai': 'Chennai',
  'kolkata': 'Kolkata',
  'pune': 'Pune',
  'ahmedabad': 'Ahmedabad',
  'jaipur': 'Jaipur',
  'lucknow': 'Lucknow',
  'kanpur': 'Kanpur',
  'nagpur': 'Nagpur',
  'indore': 'Indore',
  'bhopal': 'Bhopal',
  'patna': 'Patna',
  'ranchi': 'Ranchi',
  'guwahati': 'Guwahati',
  'bhubaneswar': 'Bhubaneswar',
  'chandigarh': 'Chandigarh',
  'noida': 'Noida',
  'gurgaon': 'Gurgaon',
  'gurugram': 'Gurugram',
  'faridabad': 'Faridabad',
  'ghaziabad': 'Ghaziabad',
  'dehradun': 'Dehradun',
  'varanasi': 'Varanasi',
  'agra': 'Agra',
  'kochi': 'Kochi',
  'thiruvananthapuram': 'Thiruvananthapuram',
  'coimbatore': 'Coimbatore',
  'madurai': 'Madurai',
  'vijayawada': 'Vijayawada',
  'visakhapatnam': 'Visakhapatnam',
  'mangalore': 'Mangalore',
  'mysore': 'Mysore',
  'hubli': 'Hubli',
  'belgaum': 'Belgaum',
  'west-bengal': 'West Bengal' // This could be mistaken, but state check has priority
};

// Streams (slug format)
export const STREAMS = [
  'engineering', 'medical', 'management', 'law', 'arts', 'science', 'commerce',
  'pharmacy', 'architecture', 'design', 'agriculture', 'education', 'nursing',
  'dental', 'hotel-management', 'mass-communication', 'computer-applications',
  'aviation', 'animation', 'fashion-design', 'interior-design', 'journalism',
  'humanities', 'social-sciences', 'fine-arts', 'performing-arts', 'media',
  'hospitality', 'tourism', 'allied-health', 'paramedical', 'veterinary',
  'ayurveda', 'homeopathy', 'unani', 'yoga', 'naturopathy'
];

// Stream name mapping (slug to display name)
export const STREAM_NAMES = {
  'engineering': 'Engineering',
  'medical': 'Medical',
  'management': 'Management',
  'law': 'Law',
  'arts': 'Arts',
  'science': 'Science',
  'commerce': 'Commerce',
  'pharmacy': 'Pharmacy',
  'architecture': 'Architecture',
  'design': 'Design',
  'agriculture': 'Agriculture',
  'education': 'Education',
  'nursing': 'Nursing',
  'dental': 'Dental',
  'hotel-management': 'Hotel Management',
  'mass-communication': 'Mass Communication',
  'computer-applications': 'Computer Applications',
  'aviation': 'Aviation',
  'animation': 'Animation',
  'fashion-design': 'Fashion Design',
  'interior-design': 'Interior Design',
  'journalism': 'Journalism',
  'humanities': 'Humanities',
  'social-sciences': 'Social Sciences',
  'fine-arts': 'Fine Arts',
  'performing-arts': 'Performing Arts',
  'media': 'Media',
  'hospitality': 'Hospitality',
  'tourism': 'Tourism',
  'allied-health': 'Allied Health',
  'paramedical': 'Paramedical',
  'veterinary': 'Veterinary',
  'ayurveda': 'Ayurveda',
  'homeopathy': 'Homeopathy',
  'unani': 'Unani',
  'yoga': 'Yoga',
  'naturopathy': 'Naturopathy'
};

// Courses (slug format)
export const COURSES = [
  'btech', 'be', 'mtech', 'me', 'mbbs', 'bds', 'bams', 'bhms', 'bpharm', 'dpharm',
  'mba', 'bba', 'pgdm', 'bms', 'bbm', 'bcom', 'mcom', 'ca', 'cs',
  'bsc', 'msc', 'ba', 'ma', 'bca', 'mca', 'llb', 'llm', 'ballb', 'bballb',
  'barch', 'march', 'bdes', 'mdes', 'bjmc', 'bhm', 'bed', 'med', 'phd',
  'diploma', 'polytechnic', 'iti', 'bvoc', 'mvoc',
  'bfa', 'mfa', 'bpe', 'mpe', 'blib', 'mlib',
  'md', 'ms', 'dm', 'mch', 'bpt', 'mpt', 'bot', 'mot',
  'bsc-nursing', 'msc-nursing', 'gnm', 'anm',
  'bba-llb', 'bcom-llb', 'ba-llb'
];

// Course name mapping (slug to display name)
export const COURSE_NAMES = {
  'btech': 'B.Tech',
  'be': 'B.E',
  'mtech': 'M.Tech',
  'me': 'M.E',
  'mbbs': 'MBBS',
  'bds': 'BDS',
  'bams': 'BAMS',
  'bhms': 'BHMS',
  'bpharm': 'B.Pharm',
  'dpharm': 'D.Pharm',
  'mba': 'MBA',
  'bba': 'BBA',
  'pgdm': 'PGDM',
  'bms': 'BMS',
  'bbm': 'BBM',
  'bcom': 'B.Com',
  'mcom': 'M.Com',
  'ca': 'CA',
  'cs': 'CS',
  'bsc': 'B.Sc',
  'msc': 'M.Sc',
  'ba': 'BA',
  'ma': 'MA',
  'bca': 'BCA',
  'mca': 'MCA',
  'llb': 'LLB',
  'llm': 'LLM',
  'ballb': 'BA LLB',
  'bballb': 'BBA LLB',
  'barch': 'B.Arch',
  'march': 'M.Arch',
  'bdes': 'B.Des',
  'mdes': 'M.Des',
  'bjmc': 'BJMC',
  'bhm': 'BHM',
  'bed': 'B.Ed',
  'med': 'M.Ed',
  'phd': 'PhD',
  'diploma': 'Diploma',
  'polytechnic': 'Polytechnic',
  'iti': 'ITI',
  'md': 'MD',
  'ms': 'MS',
  'bpt': 'BPT',
  'mpt': 'MPT',
  'bsc-nursing': 'B.Sc Nursing',
  'msc-nursing': 'M.Sc Nursing',
  'gnm': 'GNM',
  'anm': 'ANM'
};

// Check functions
export const isState = (slug) => INDIAN_STATES.includes(slug?.toLowerCase());
export const isCity = (slug) => INDIAN_CITIES.includes(slug?.toLowerCase());
export const isStream = (slug) => STREAMS.includes(slug?.toLowerCase());
export const isCourse = (slug) => COURSES.includes(slug?.toLowerCase());

// Get display name functions
export const getStateName = (slug) => STATE_NAMES[slug?.toLowerCase()] || slug;
export const getCityName = (slug) => CITY_NAMES[slug?.toLowerCase()] || slug;
export const getStreamName = (slug) => STREAM_NAMES[slug?.toLowerCase()] || slug;
export const getCourseName = (slug) => COURSE_NAMES[slug?.toLowerCase()] || slug;

/**
 * Identify what type of segment this is
 * Priority: STATE > CITY > STREAM > COURSE
 */
export const identifySegment = (slug) => {
  if (!slug) return { type: 'unknown', value: null };
  
  const lowerSlug = slug.toLowerCase();
  
  if (isState(lowerSlug)) {
    return { type: 'state', value: lowerSlug, displayName: getStateName(lowerSlug) };
  }
  if (isCity(lowerSlug)) {
    return { type: 'city', value: lowerSlug, displayName: getCityName(lowerSlug) };
  }
  if (isStream(lowerSlug)) {
    return { type: 'stream', value: lowerSlug, displayName: getStreamName(lowerSlug) };
  }
  if (isCourse(lowerSlug)) {
    return { type: 'course', value: lowerSlug, displayName: getCourseName(lowerSlug) };
  }
  
  return { type: 'unknown', value: lowerSlug };
};

/**
 * Parse the new URL structure
 * 
 * /university - All universities
 * /university/west-bengal - State
 * /university/kolkata - City
 * /university/west-bengal/kolkata - State+City
 * /university/engineering - Stream
 * /university/btech - Course
 * /university/engineering/btech - Stream+Course
 * /university/west-bengal/engineering - State+Stream
 * /university/kolkata/engineering - City+Stream
 * /university/west-bengal/engineering/btech - State+Stream+Course
 * /university/kolkata/engineering/btech - City+Stream+Course
 * 
 * Same for /colleges and /schools
 */
export const parseInstitutionUrl = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  
  if (parts.length === 0) {
    return { type: 'home' };
  }
  
  const institutionType = parts[0]; // 'university', 'colleges', 'schools'
  
  // Check if it's a valid institution type
  if (!['university', 'colleges', 'schools'].includes(institutionType)) {
    return { type: 'unknown', parts };
  }
  
  const result = {
    type: 'institution-listing',
    institutionType: institutionType,
    state: null,
    city: null,
    stream: null,
    course: null,
    filters: {}
  };
  
  // No additional segments - show all
  if (parts.length === 1) {
    return result;
  }
  
  // Parse remaining segments
  const segments = parts.slice(1);
  
  // Identify each segment
  const identified = segments.map(seg => identifySegment(seg));
  
  // Build filters based on identified segments
  for (const seg of identified) {
    switch (seg.type) {
      case 'state':
        if (!result.state) {
          result.state = seg.value;
          result.filters.state = seg.displayName;
        }
        break;
      case 'city':
        if (!result.city) {
          result.city = seg.value;
          result.filters.city = seg.displayName;
        }
        break;
      case 'stream':
        if (!result.stream) {
          result.stream = seg.value;
          result.filters.stream = seg.displayName;
        }
        break;
      case 'course':
        if (!result.course) {
          result.course = seg.value;
          result.filters.course = seg.displayName;
        }
        break;
      default:
        // Unknown segment - could be a detail page ID
        if (seg.value && seg.value.match(/^\d+-/)) {
          // This is a detail page: /colleges/001-iit-bombay
          return {
            type: 'institution-detail',
            institutionType: institutionType,
            idSlug: seg.value
          };
        }
        break;
    }
  }
  
  return result;
};

/**
 * Generate page title based on parsed URL
 */
export const generatePageTitle = (parsed) => {
  if (parsed.type !== 'institution-listing') return '';
  
  const parts = [];
  
  // Add course if present
  if (parsed.filters.course) {
    parts.push(parsed.filters.course);
  }
  
  // Add stream if present
  if (parsed.filters.stream) {
    parts.push(parsed.filters.stream);
  }
  
  // Institution type
  const typeLabel = {
    'university': 'Universities',
    'colleges': 'Colleges',
    'schools': 'Schools'
  }[parsed.institutionType] || 'Institutions';
  
  parts.push(typeLabel);
  
  // Add location
  if (parsed.filters.city && parsed.filters.state) {
    parts.push(`in ${parsed.filters.city}, ${parsed.filters.state}`);
  } else if (parsed.filters.city) {
    parts.push(`in ${parsed.filters.city}`);
  } else if (parsed.filters.state) {
    parts.push(`in ${parsed.filters.state}`);
  } else {
    parts.push('in India');
  }
  
  return parts.join(' ');
};

/**
 * Generate meta description based on parsed URL
 */
export const generateMetaDescription = (parsed, count = 0) => {
  if (parsed.type !== 'institution-listing') return '';
  
  const typeLabel = {
    'university': 'universities',
    'colleges': 'colleges',
    'schools': 'schools'
  }[parsed.institutionType] || 'institutions';
  
  let location = 'India';
  if (parsed.filters.city && parsed.filters.state) {
    location = `${parsed.filters.city}, ${parsed.filters.state}`;
  } else if (parsed.filters.city) {
    location = parsed.filters.city;
  } else if (parsed.filters.state) {
    location = parsed.filters.state;
  }
  
  let offering = '';
  if (parsed.filters.course && parsed.filters.stream) {
    offering = ` offering ${parsed.filters.course} in ${parsed.filters.stream}`;
  } else if (parsed.filters.stream) {
    offering = ` for ${parsed.filters.stream}`;
  } else if (parsed.filters.course) {
    offering = ` offering ${parsed.filters.course}`;
  }
  
  const countText = count > 0 ? `Explore ${count}+ ` : 'Find the best ';
  
  return `${countText}${typeLabel}${offering} in ${location}. Compare fees, placements, rankings, and admission details.`;
};

// Legacy exports for backward compatibility
export { generateSlug };

export const getInstitutionListingUrl = (type, location = null) => {
  const suffix = type?.toLowerCase() === 'university' ? 'university' : 
                 type?.toLowerCase() === 'school' ? 'schools' : 'colleges';
  
  if (!location) {
    return `/${suffix}`;
  }
  
  const locationSlug = generateSlug(location);
  return `/${suffix}/${locationSlug}`;
};

export const getInstitutionDetailUrl = (type, id, name, city = null, serialNumber = null) => {
  const typeSuffix = type?.toLowerCase() === 'university' ? 'university' : 
                     type?.toLowerCase() === 'school' ? 'schools' : 'colleges';
  const nameSlug = generateSlug(name);
  
  let numericId;
  if (serialNumber) {
    numericId = String(serialNumber).padStart(3, '0');
  } else {
    const idMatch = id?.match(/(\d+)$/);
    numericId = idMatch ? idMatch[1] : '000';
  }
  
  let finalSlug = nameSlug;
  if (city) {
    const citySlug = generateSlug(city);
    const mainCityPart = citySlug.split('-').pop();
    const nameHasCity = nameSlug.toLowerCase().includes(citySlug.toLowerCase()) || 
                        nameSlug.toLowerCase().includes(mainCityPart.toLowerCase());
    if (!nameHasCity) {
      finalSlug = `${nameSlug}-${citySlug}`;
    }
  }
  
  return `/${typeSuffix}/${numericId}-${finalSlug}`;
};

export default {
  generateSlug,
  parseInstitutionUrl,
  generatePageTitle,
  generateMetaDescription,
  identifySegment,
  isState,
  isCity,
  isStream,
  isCourse,
  getStateName,
  getCityName,
  getStreamName,
  getCourseName,
  getInstitutionListingUrl,
  getInstitutionDetailUrl,
  INDIAN_STATES,
  INDIAN_CITIES,
  STREAMS,
  COURSES,
  STATE_NAMES,
  CITY_NAMES,
  STREAM_NAMES,
  COURSE_NAMES,
  INSTITUTION_TYPES
};
