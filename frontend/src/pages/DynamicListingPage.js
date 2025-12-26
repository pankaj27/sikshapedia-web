import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Link } from '../components/CustomLink';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiStar, FiBookmark, FiArrowRight, FiX, FiEdit3, FiGrid, FiTarget, FiUser, FiCheckCircle, FiAward, FiBookOpen, FiHeart, FiSend } from 'react-icons/fi';
import api from '../api/axios';
import { useYear } from '../hooks/useYear';
import { AuthorInfoHero } from '../components/AuthorInfo';
import { UrlAwareSponsoredSection } from '../components/SponsoredAds';
import { 
  parseInstitutionUrl, 
  generatePageTitle, 
  generateMetaDescription,
  isState, 
  isCity, 
  isStream,
  isCourse,
  getStateName,
  getCityName,
  getStreamName,
  getCourseName,
  INDIAN_STATES, 
  INDIAN_CITIES,
  getInstitutionDetailUrl, 
  getInstitutionListingUrl 
} from '../utils/urlHelpers';
import { generateSlug } from '../utils/slugify';
import { Button } from '../components/ui/button';
import AdBanner from '../components/AdBanner';
import ApplyNowModal from '../components/ApplyNowModal';

// Mapping of URL slugs to display names
const STREAM_DISPLAY_NAMES = {
  'engineering': 'Engineering',
  'btech': 'B.Tech',
  'mba': 'MBA',
  'medical': 'Medical',
  'mbbs': 'MBBS',
  'law': 'Law',
  'arts': 'Arts',
  'commerce': 'Commerce',
  'science': 'Science',
  'management': 'Management',
  'computer-science': 'Computer Science',
  'mechanical': 'Mechanical Engineering',
  'civil': 'Civil Engineering',
  'electrical': 'Electrical Engineering',
  'electronics': 'Electronics',
  'information-technology': 'Information Technology',
  'biotechnology': 'Biotechnology',
  'pharmacy': 'Pharmacy',
  'nursing': 'Nursing',
  'dental': 'Dental',
  'agriculture': 'Agriculture',
  'architecture': 'Architecture',
  'design': 'Design',
  'hotel-management': 'Hotel Management',
  'mass-communication': 'Mass Communication',
  'education': 'Education',
  'finance': 'Finance',
  'marketing': 'Marketing',
  'hr': 'Human Resources',
};

// Convert slug to proper display name
const toDisplayName = (slug) => {
  if (!slug) return '';
  if (STREAM_DISPLAY_NAMES[slug]) return STREAM_DISPLAY_NAMES[slug];
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

const DynamicListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { year } = useYear(); // Get current year from settings
  
  // Check if this is a detail page URL (e.g., /colleges/001-iit-bombay)
  // Detail page URLs have a numeric prefix like "001-" or "1-"
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && ['colleges', 'schools', 'university'].includes(parts[0])) {
      const secondPart = parts[1];
      // Check if it matches detail page pattern: number-slug or number (like 001-iit-bombay)
      if (/^\d+-/.test(secondPart) || /^\d+$/.test(secondPart)) {
        // This is a detail page, redirect to the proper route
        // The detail pages are already handled by specific routes, 
        // so this shouldn't normally be reached
        console.log('Detail page detected, this should be handled by InstitutionDetailPage');
        return;
      }
    }
  }, [location.pathname]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [allInstitutionsData, setAllInstitutionsData] = useState([]); // Store all fetched data for infinite scroll
  const [totalCount, setTotalCount] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [sortBy, setSortBy] = useState('ranking');
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);
  const [pageContent, setPageContent] = useState(null); // Content from admin
  const [hasMore, setHasMore] = useState(true);
  const [featuredColleges, setFeaturedColleges] = useState([]); // Featured/Sponsored colleges
  const [admissionOpenColleges, setAdmissionOpenColleges] = useState([]); // Admissions Open colleges
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [cityFilterSearch, setCityFilterSearch] = useState(''); // Search text for city filter
  const [stateFilterSearch, setStateFilterSearch] = useState(''); // Search text for state filter
  const [quickActionSettings, setQuickActionSettings] = useState(null); // Quick action cards settings
  
  // Ref for infinite scroll observer
  const loadMoreRef = useRef(null);
  
  const [filters, setFilters] = useState({
    search: '',
    type: [],
    city: '',
    state: '',
    minFees: '',
    maxFees: '',
    stream: '',
    subStream: '',
    course: '',
    degreeType: '',
    examAccepted: '',
    affiliation: '',
    recognition: '',
    accreditation: '',
    programType: '',
  });
  
  // Master location data
  const [masterStates, setMasterStates] = useState([]);
  const [masterCities, setMasterCities] = useState([]);
  
  // Master streams and courses data
  const [masterStreams, setMasterStreams] = useState([]);
  const [masterCourses, setMasterCourses] = useState([]);
  
  // Master exams data
  const [masterExams, setMasterExams] = useState([]);
  
  // Master degree types (from courses)
  const [masterDegreeTypes, setMasterDegreeTypes] = useState([]);
  
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  
  // Parse URL using new URL structure
  const urlInfo = useMemo(() => parseInstitutionUrl(location.pathname), [location.pathname]);
  
  // Parse query parameters for secondary filters (type, accreditation, degree, exam, affiliation, recognition)
  const queryFilters = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      collegeType: params.get('type') || null,
      accreditation: params.get('accreditation') || null,
      degreeType: params.get('degree') || null,
      examAccepted: params.get('exam') || null,
      affiliation: params.get('affiliation') || null,
      recognition: params.get('recognition') || null,
    };
  }, [location.search]);
  
  // Accreditation display names mapping
  const ACCREDITATION_DISPLAY = {
    'naac-a-plus-plus': 'NAAC A++',
    'naac-a-plus': 'NAAC A+',
    'naac-a': 'NAAC A',
    'naac-b-plus-plus': 'NAAC B++',
    'naac-b-plus': 'NAAC B+',
    'naac-b': 'NAAC B',
    'naac-c': 'NAAC C',
    'nba-accredited': 'NBA Accredited',
    'nirf-ranked': 'NIRF Ranked'
  };

  // College type display names
  const TYPE_DISPLAY = {
    'government': 'Government',
    'private': 'Private',
    'deemed': 'Deemed',
    'autonomous': 'Autonomous',
    'public-private': 'Public-Private',
    'aided': 'Aided'
  };

  // Determine page title and type from URL - NEW URL STRUCTURE
  const pageInfo = useMemo(() => {
    // Handle new URL structure: /university, /colleges, /schools
    if (urlInfo.type === 'institution-listing') {
      const isSchools = urlInfo.institutionType === 'schools';
      const isUniversity = urlInfo.institutionType === 'university';
      const typeName = isSchools ? 'Schools' : isUniversity ? 'Universities' : 'Colleges';
      
      // Build title based on filters (with safety check)
      const filters = urlInfo.filters || {};
      let titleParts = [];
      
      // Add course if present
      if (filters.course) {
        titleParts.push(filters.course);
      }
      
      // Add stream if present
      if (filters.stream) {
        titleParts.push(filters.stream);
      }
      
      titleParts.push(typeName);
      
      // Add location
      if (filters.city && filters.state) {
        titleParts.push(`in ${filters.city}, ${filters.state}`);
      } else if (filters.city) {
        titleParts.push(`in ${filters.city}`);
      } else if (filters.state) {
        titleParts.push(`in ${filters.state}`);
      } else {
        titleParts.push('in India');
      }
      
      // Determine institution types for API query
      let institutionTypes = ['College'];
      if (isSchools) {
        institutionTypes = ['School'];
      } else if (isUniversity) {
        institutionTypes = ['University'];
      }
      
      return {
        title: `Top ${titleParts.join(' ')} ${year}`,
        description: generateMetaDescription(urlInfo),
        institutionTypes: institutionTypes,
        institutionType: urlInfo.institutionType,
        stream: urlInfo.stream,
        course: urlInfo.course,
        state: urlInfo.state,
        city: urlInfo.city,
        location: urlInfo.city || urlInfo.state,
        locationType: urlInfo.city ? 'city' : urlInfo.state ? 'state' : null,
        filters: filters,
        isSchools,
        isUniversity
      };
    }
    
    // Handle institution detail page
    if (urlInfo.type === 'institution-detail') {
      return {
        type: 'detail',
        institutionType: urlInfo.institutionType,
        idSlug: urlInfo.idSlug
      };
    }
    
    // Legacy URL handling for backward compatibility
    if (urlInfo.combinedFilters) {
      const cf = urlInfo.combinedFilters;
      const isSchools = urlInfo.institutionType === 'schools';
      const typeName = isSchools ? 'Schools' : 'Colleges';
      
      let titleParts = [];
      if (cf.collegeType) titleParts.push(TYPE_DISPLAY[cf.collegeType] || toDisplayName(cf.collegeType));
      if (cf.accreditation) titleParts.push(ACCREDITATION_DISPLAY[cf.accreditation] || toDisplayName(cf.accreditation));
      if (cf.stream) titleParts.push(toDisplayName(cf.stream));
      
      titleParts.push(typeName);
      
      if (cf.state) titleParts.push(`in ${toDisplayName(cf.state)}`);
      if (cf.city) titleParts.push(`in ${toDisplayName(cf.city)}`);
      if (cf.location && !cf.state && !cf.city) {
        titleParts.push(`in ${toDisplayName(cf.location)}`);
      }
      
      return {
        title: `Top ${titleParts.join(' ')} ${year}`,
        description: `Explore top ${typeName.toLowerCase()} with applied filters.`,
        institutionTypes: isSchools ? ['School'] : ['College', 'University'],
        stream: cf.stream || null,
        state: cf.state || null,
        city: cf.city || null,
        location: cf.location || cf.city || null,
        locationType: cf.state ? 'state' : (cf.city || cf.location) ? 'city' : null,
        collegeType: cf.collegeType || null,
        accreditation: cf.accreditation || null,
        queryFilters: urlInfo.queryFilters || {},
        isSchools
      };
    }
    
    return {
      title: `Top Colleges in India ${year}`,
      description: 'Explore top institutions in India',
      institutionTypes: ['College', 'University'],
      isSchools: false
    };
  }, [urlInfo, year]);
  
  // Active filters based on URL - NEW STRUCTURE
  const activeFilters = useMemo(() => {
    const active = {
      stream: null,
      course: null,
      subStream: null,
      state: null,
      city: null,
      collegeType: null,
      accreditation: null,
      degreeType: null,
      examAccepted: null,
      affiliation: null,
      recognition: null,
    };
    
    // Use pageInfo filters from new URL structure (path-based filters)
    if (pageInfo.filters) {
      if (pageInfo.filters.stream) {
        active.stream = pageInfo.filters.stream;
      }
      if (pageInfo.filters.course) {
        active.course = pageInfo.filters.course;
      }
      if (pageInfo.filters.state) {
        active.state = pageInfo.filters.state;
      }
      if (pageInfo.filters.city) {
        active.city = pageInfo.filters.city;
      }
    }
    
    // Fallback to pageInfo direct fields
    if (pageInfo.stream && !active.stream) {
      active.stream = toDisplayName(pageInfo.stream);
    }
    if (pageInfo.course && !active.course) {
      active.course = toDisplayName(pageInfo.course);
    }
    if (pageInfo.state && !active.state) {
      active.state = toDisplayName(pageInfo.state);
    }
    if (pageInfo.city && !active.city) {
      active.city = toDisplayName(pageInfo.city);
    }
    
    // Legacy support
    if (pageInfo.subStream && !active.subStream) {
      active.subStream = toDisplayName(pageInfo.subStream);
    }
    if (pageInfo.location && !active.state && !active.city) {
      const locationName = toDisplayName(pageInfo.location);
      if (pageInfo.locationType === 'state') {
        active.state = locationName;
      } else if (pageInfo.locationType === 'city') {
        active.city = locationName;
      }
    }
    if (pageInfo.collegeType && !active.collegeType) {
      active.collegeType = TYPE_DISPLAY[pageInfo.collegeType] || toDisplayName(pageInfo.collegeType);
    }
    if (pageInfo.accreditation && !active.accreditation) {
      active.accreditation = ACCREDITATION_DISPLAY[pageInfo.accreditation] || toDisplayName(pageInfo.accreditation);
    }
    
    // Parse query parameters for secondary filters (type, accreditation, degree, exam, affiliation, recognition)
    if (queryFilters.collegeType && !active.collegeType) {
      active.collegeType = TYPE_DISPLAY[queryFilters.collegeType] || toDisplayName(queryFilters.collegeType);
    }
    if (queryFilters.accreditation && !active.accreditation) {
      active.accreditation = ACCREDITATION_DISPLAY[queryFilters.accreditation] || toDisplayName(queryFilters.accreditation);
    }
    if (queryFilters.degreeType) {
      active.degreeType = toDisplayName(queryFilters.degreeType);
    }
    if (queryFilters.examAccepted) {
      active.examAccepted = toDisplayName(queryFilters.examAccepted);
    }
    if (queryFilters.affiliation) {
      active.affiliation = toDisplayName(queryFilters.affiliation);
    }
    if (queryFilters.recognition) {
      active.recognition = toDisplayName(queryFilters.recognition);
    }
    
    return active;
  }, [pageInfo, queryFilters]);
  
  // Fetch master location data AND streams/courses/exams
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [statesRes, citiesRes, streamsRes, coursesRes, examsRes, quickActionRes] = await Promise.all([
          api.get('/locations/all-states'),
          api.get('/locations/all-cities'),
          api.get('/streams'),
          api.get('/courses?limit=500'),
          api.get('/exams?limit=500'),
          api.get('/quick-action-cards-settings')
        ]);
        const activeStates = (statesRes.data || [])
          .filter(s => s.status === 'active')
          .map(s => s.name)
          .sort();
        setMasterStates(activeStates);
        setMasterCities((citiesRes.data || []).filter(c => c.status === 'active'));
        
        // Set quick action cards settings
        setQuickActionSettings(quickActionRes.data || null);
        
        // Set streams - filter active ones and extract names
        const activeStreams = (streamsRes.data || [])
          .filter(s => s.is_active !== false)
          .map(s => s.name)
          .sort();
        setMasterStreams(activeStreams);
        
        // Set courses - filter active ones and extract names (excluding 'School' type)
        const coursesData = coursesRes.data || [];
        const activeCourses = coursesData
          .filter(c => c.is_active !== false && c.name !== 'School')
          .map(c => c.name)
          .sort();
        setMasterCourses(activeCourses);
        
        // Extract unique degree types from courses
        const degreeTypes = [...new Set(coursesData
          .filter(c => c.degree_type)
          .map(c => c.degree_type)
        )].sort();
        setMasterDegreeTypes(degreeTypes);
        
        // Set exams - extract names
        const activeExams = (examsRes.data || [])
          .filter(e => e.is_active !== false)
          .map(e => e.name)
          .sort();
        setMasterExams(activeExams);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };
    fetchMasterData();
  }, []);
  
  // All Indian States - use master data if available, fallback to hardcoded
  const allStates = masterStates.length > 0 ? masterStates : [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    // Union Territories
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 
    'Chandigarh', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'
  ];

  // Cities by State
  const citiesByState = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada', 'Kadapa', 'Anantapur'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Panchkula'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Manali', 'Kangra'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary', 'Shimoga', 'Tumkur'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Palakkad', 'Malappuram'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar', 'Bhilwara', 'Sikar', 'Sri Ganganagar'],
    'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thanjavur'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Ghaziabad', 'Noida', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Rishikesh', 'Nainital'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Kharagpur'],
    'Delhi': ['New Delhi', 'Delhi', 'Dwarka', 'Rohini', 'Saket', 'Karol Bagh'],
    'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua'],
    'Ladakh': ['Leh', 'Kargil'],
    'Puducherry': ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'],
    'Chandigarh': ['Chandigarh'],
    'Andaman and Nicobar Islands': ['Port Blair'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Daman', 'Diu', 'Silvassa'],
    'Lakshadweep': ['Kavaratti']
  };

  // Get cities based on selected state - prefer master data
  const getAvailableCities = useMemo(() => {
    if (activeFilters.state) {
      // Use master data if available
      if (masterCities.length > 0) {
        const stateCities = masterCities
          .filter(c => c.state === activeFilters.state)
          .map(c => c.name)
          .sort();
        if (stateCities.length > 0) return stateCities;
      }
      // Fallback to hardcoded
      return citiesByState[activeFilters.state] || [];
    }
    // If no state selected, show all cities from master data (sorted alphabetically)
    if (masterCities.length > 0) {
      return masterCities.map(c => c.name).sort();
    }
    return [];
  }, [masterCities, activeFilters.state]);

  // Filter options - Populate from master data with sensible fallbacks
  const filterOptions = {
    subStream: masterStreams.length > 0 ? masterStreams : [
      'Engineering & Technology', 'Medical & Health Sciences', 'Management & Business',
      'Arts & Humanities', 'Science', 'Commerce', 'Law', 'Education', 'Design'
    ],
    course: masterCourses.length > 0 ? masterCourses : [
      'B.Tech', 'MBA', 'MBBS', 'BBA', 'B.Com', 'BA', 'B.Sc', 'BCA', 'LLB', 'B.Ed'
    ],
    degreeType: masterDegreeTypes.length > 0 ? masterDegreeTypes : [
      'Bachelor', 'Master', 'Doctorate', 'Diploma', 'PG Diploma', 'Certificate'
    ],
    examAccepted: masterExams.length > 0 ? masterExams : [
      'JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'MAT', 'XAT', 'GATE', 'CLAT', 
      'CUET', 'BITSAT', 'VITEEE', 'MHT CET', 'KCET', 'COMEDK'
    ],
    affiliation: [
      'UGC', 'AICTE', 'University Affiliated', 'Autonomous', 'State University',
      'Central University', 'Deemed University', 'Private University'
    ],
    recognition: [
      'UGC Recognized', 'AICTE Approved', 'NAAC Accredited', 'NBA Accredited',
      'Government Recognized', 'AIU Member', 'ISO Certified'
    ],
    collegeType: ['Government', 'Private', 'Deemed', 'Autonomous', 'Aided', 'Public-Private'],
    accreditation: [
      'NAAC A++', 'NAAC A+', 'NAAC A', 'NAAC B++', 'NAAC B+', 'NAAC B', 'NAAC C',
      'NBA Accredited', 'NIRF Ranked', 'QS Ranked', 'ABET Accredited'
    ],
    state: allStates,
    city: getAvailableCities,
    programType: ['Full Time', 'Part Time', 'Distance', 'Online', 'Weekend', 'Executive']
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFilterDropdown && !event.target.closest('.relative')) {
        setActiveFilterDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeFilterDropdown]);

  useEffect(() => {
    // Reset state when URL changes
    setInstitutions([]);
    setAllInstitutionsData([]);
    setPagination(prev => ({ ...prev, page: 1 }));
    setHasMore(true);
  }, [location.pathname]);
  
  // Separate effect for fetching data - only runs when pageInfo is stable
  useEffect(() => {
    if (pageInfo && pageInfo.title) {
      fetchInstitutions();
      fetchPageContent();
      fetchFeaturedColleges();
      fetchAdmissionOpenColleges();
    }
  }, [pageInfo?.institutionType, pageInfo?.state, pageInfo?.city, pageInfo?.stream, pageInfo?.course, filters.search, sortBy]);
  
  // Fetch featured/sponsored colleges (from admin-managed multi-placement ads)
  const fetchFeaturedColleges = async () => {
    // Get current URL path for custom placement lookup
    const urlPath = location.pathname.replace(/^\//, '') + location.search;
    
    try {
      // First try URL-specific custom placement
      const customResponse = await api.get(`/sponsored-ads-by-url?url=${encodeURIComponent(urlPath)}&section_type=featured`);
      if (customResponse.data && customResponse.data.length > 0) {
        setFeaturedColleges(customResponse.data);
        return;
      }
    } catch (error) {
      console.error('Custom placement not available:', error);
    }
    
    // Determine fallback placement based on page type
    const placementId = pageInfo.isSchools ? 'school_listing_featured' : 'college_listing_featured';
    
    try {
      // Try admin-managed multi-placement sponsored ads
      const response = await api.get(`/sponsored-ads-multi/${placementId}?limit=6`);
      if (response.data && response.data.length > 0) {
        setFeaturedColleges(response.data);
        return;
      }
    } catch (error) {
      console.error('Multi-placement ads not available:', error);
    }
    
    // Fallback to priority-based or regular featured query
    try {
      const fallback = await api.get('/colleges/featured-priority?limit=6');
      if (fallback.data && fallback.data.length > 0) {
        setFeaturedColleges(fallback.data);
      }
    } catch (e) {
      try {
        const fallback2 = await api.get('/colleges?is_featured=true&limit=6');
        if (fallback2.data && fallback2.data.length > 0) {
          setFeaturedColleges(fallback2.data);
        }
      } catch (e2) {
        // Ignore error silently
      }
    }
  };
  
  // Fetch admissions open colleges (from admin-managed multi-placement ads)
  const fetchAdmissionOpenColleges = async () => {
    // Get current URL path for custom placement lookup
    const urlPath = location.pathname.replace(/^\//, '') + location.search;
    
    try {
      // First try URL-specific custom placement
      const customResponse = await api.get(`/sponsored-ads-by-url?url=${encodeURIComponent(urlPath)}&section_type=admission`);
      if (customResponse.data && customResponse.data.length > 0) {
        setAdmissionOpenColleges(customResponse.data);
        return;
      }
    } catch (error) {
      console.error('Custom placement not available:', error);
    }
    
    // Determine fallback placement based on page type
    const placementId = pageInfo.isSchools ? 'school_listing_admission' : 'college_listing_admission';
    
    try {
      // Try admin-managed multi-placement sponsored ads
      const response = await api.get(`/sponsored-ads-multi/${placementId}?limit=6`);
      if (response.data && response.data.length > 0) {
        setAdmissionOpenColleges(response.data);
        return;
      }
    } catch (error) {
      console.error('Multi-placement ads not available:', error);
    }
    
    // Fallback to priority-based or regular admission open query
    try {
      const fallback = await api.get('/colleges/admission-open-priority?limit=6');
      if (fallback.data && fallback.data.length > 0) {
        setAdmissionOpenColleges(fallback.data);
      }
    } catch (e) {
      try {
        const fallback2 = await api.get('/colleges?is_admission_open=true&limit=6');
        if (fallback2.data && fallback2.data.length > 0) {
          setAdmissionOpenColleges(fallback2.data);
        }
      } catch (e2) {
        // Ignore error silently
      }
    }
  };
  
  // Fetch page content from admin panel
  const fetchPageContent = async () => {
    try {
      // Build the URL slug to look up
      const pathParts = location.pathname.split('/').filter(Boolean);
      let slug = pathParts.join('/') || 'colleges';
      
      // Also try without trailing path
      if (pathParts.length === 1) {
        slug = pathParts[0];
      }
      
      const response = await api.get(`/listing-pages/by-slug/${slug}`);
      if (response.data) {
        setPageContent(response.data);
      }
    } catch (error) {
      // No content found for this page - that's okay
      setPageContent(null);
    }
  };
  
  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      // Determine which API endpoint to use based on institution type
      const getApiEndpoint = () => {
        if (pageInfo.isUniversity) {
          return '/universities';
        } else if (pageInfo.isSchools) {
          return '/schools';
        }
        return '/colleges';
      };
      
      const buildQueryParams = (institutionType = null) => {
        let queryParams = new URLSearchParams();
        queryParams.append('limit', 100);
        
        const endpoint = getApiEndpoint();
        const isCollegesEndpoint = endpoint === '/colleges';
        
        // Only add fields=minimal for colleges endpoint
        if (isCollegesEndpoint) {
          queryParams.append('fields', 'minimal');
        }
        
        if (institutionType && isCollegesEndpoint) {
          queryParams.append('institution_type', institutionType);
        }
        
        // Handle new URL structure filters
        if (pageInfo.filters) {
          if (pageInfo.filters.state) {
            queryParams.append('state', pageInfo.filters.state);
          }
          if (pageInfo.filters.city) {
            queryParams.append('city', pageInfo.filters.city);
          }
          if (pageInfo.filters.stream) {
            queryParams.append('stream', pageInfo.filters.stream);
          }
          if (pageInfo.filters.course) {
            queryParams.append('course', pageInfo.filters.course);
          }
        }
        
        // Fallback to direct pageInfo fields
        if (pageInfo.state && !pageInfo.filters?.state) {
          queryParams.append('state', toDisplayName(pageInfo.state));
        }
        if (pageInfo.city && !pageInfo.filters?.city) {
          queryParams.append('city', toDisplayName(pageInfo.city));
        }
        
        // Handle single location filter (legacy)
        if (pageInfo.location && !pageInfo.state && !pageInfo.city && !pageInfo.filters?.state && !pageInfo.filters?.city) {
          const locationDisplay = toDisplayName(pageInfo.location);
          if (pageInfo.locationType === 'state') {
            queryParams.append('state', locationDisplay);
          } else if (pageInfo.locationType === 'city') {
            queryParams.append('city', locationDisplay);
          }
        }
        
        if (pageInfo.stream && !pageInfo.filters?.stream) {
          queryParams.append('stream', toDisplayName(pageInfo.stream));
        }
        
        if (pageInfo.course && !pageInfo.filters?.course) {
          queryParams.append('course', toDisplayName(pageInfo.course));
        }
        
        if (pageInfo.subStream) {
          queryParams.append('sub_stream', toDisplayName(pageInfo.subStream));
        }
        
        if (filters.search) {
          queryParams.append('search', filters.search);
        }
        
        if (filters.type.length > 0 && isCollegesEndpoint) {
          queryParams.append('type', filters.type[0]);
        }
        
        return queryParams;
      };
      
      let allData = [];
      const endpoint = getApiEndpoint();
      
      // For universities and schools, don't use institutionTypes loop
      if (endpoint !== '/colleges') {
        const queryParams = buildQueryParams();
        const response = await api.get(`${endpoint}?${queryParams.toString()}`);
        allData = response.data || [];
        // Add institution_type to each item for proper URL generation
        const instType = pageInfo.isUniversity ? 'university' : pageInfo.isSchools ? 'school' : 'college';
        allData = allData.map(item => ({ ...item, institution_type: instType }));
      } else if (pageInfo.institutionTypes && pageInfo.institutionTypes.length > 0) {
        const fetchPromises = pageInfo.institutionTypes.map(async (type) => {
          const queryParams = buildQueryParams(type);
          const response = await api.get(`${endpoint}?${queryParams.toString()}`);
          return response.data || [];
        });
        
        const results = await Promise.all(fetchPromises);
        allData = results.flat();
      } else {
        const queryParams = buildQueryParams();
        const response = await api.get(`${endpoint}?${queryParams.toString()}`);
        allData = response.data || [];
      }
      
      // Sort
      if (sortBy === 'rating') {
        allData.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === 'fees-low') {
        allData.sort((a, b) => (a.average_fees || 0) - (b.average_fees || 0));
      } else if (sortBy === 'fees-high') {
        allData.sort((a, b) => (b.average_fees || 0) - (a.average_fees || 0));
      } else {
        allData.sort((a, b) => (a.nirf_ranking || a.nirf_rank || 999) - (b.nirf_ranking || b.nirf_rank || 999));
      }
      
      // Store all data for infinite scroll
      setAllInstitutionsData(allData);
      setTotalCount(allData.length);
      
      // Initial load - show first batch
      const initialBatch = allData.slice(0, pagination.limit);
      setInstitutions(initialBatch);
      setHasMore(initialBatch.length < allData.length);
      setPagination(prev => ({ ...prev, page: 1, total: allData.length }));
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setInstitutions([]);
      setAllInstitutionsData([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    // Simulate a small delay to show loading state
    setTimeout(() => {
      const nextPage = pagination.page + 1;
      const start = pagination.page * pagination.limit;
      const end = start + pagination.limit;
      const newBatch = allInstitutionsData.slice(start, end);
      
      if (newBatch.length > 0) {
        setInstitutions(prev => [...prev, ...newBatch]);
        setPagination(prev => ({ ...prev, page: nextPage }));
        setHasMore(end < allInstitutionsData.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 300);
  }, [loadingMore, hasMore, pagination.page, pagination.limit, allInstitutionsData]);
  
  // Infinite scroll observer - must be after loadMore is defined
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMore]);
  
  // Slug mappings for Type and Accreditation
  const TYPE_TO_SLUG = {
    'Government': 'government',
    'Private': 'private',
    'Deemed': 'deemed',
    'Autonomous': 'autonomous',
    'Public-Private': 'public-private',
    'Aided': 'aided'
  };

  const ACCREDITATION_TO_SLUG = {
    'NAAC A++ (Highest)': 'naac-a-plus-plus',
    'NAAC A+': 'naac-a-plus',
    'NAAC A': 'naac-a',
    'NAAC B++': 'naac-b-plus-plus',
    'NAAC B+': 'naac-b-plus',
    'NAAC B': 'naac-b',
    'NAAC C': 'naac-c',
    'NBA Accredited': 'nba-accredited',
    'NIRF Ranked': 'nirf-ranked'
  };

  // Build URL with query parameters for secondary filters
  const buildUrlWithQueryParams = (basePath, newFilter = null) => {
    const queryParams = new URLSearchParams(location.search);
    
    // Add new filter if provided
    if (newFilter) {
      const { type, value } = newFilter;
      const slug = generateSlug(value);
      if (type === 'course') queryParams.set('course', slug);
      else if (type === 'degreeType') queryParams.set('degree', slug);
      else if (type === 'examAccepted') queryParams.set('exam', slug);
      else if (type === 'affiliation') queryParams.set('affiliation', slug);
      else if (type === 'recognition') queryParams.set('recognition', slug);
    }
    
    const queryString = queryParams.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Handle filter selection - Navigate to NEW SEO-friendly URL structure
  // NEW URL format: /colleges/{state}/{city}/{stream}/{course}
  const handleFilterSelect = (filterType, value) => {
    setActiveFilterDropdown(null);
    
    // Determine base path based on institution type
    const baseSuffix = pageInfo.isUniversity ? 'university' : pageInfo.isSchools ? 'schools' : 'colleges';
    
    // Get current filters from URL (these are already slugs)
    const currentStream = urlInfo.stream;
    const currentState = urlInfo.state;
    const currentCity = urlInfo.city;
    const currentCourse = urlInfo.course;
    
    // Helper to build the final URL
    // Pattern: /colleges/{state}/{city}/{stream}/{course}
    const buildNewUrl = (state, city, stream, course) => {
      let segments = [baseSuffix];
      
      // Add state if present
      if (state) segments.push(generateSlug(state));
      // Add city if present (can be with or without state)
      if (city) segments.push(generateSlug(city));
      // Add stream if present
      if (stream) segments.push(generateSlug(stream));
      // Add course if present
      if (course) segments.push(generateSlug(course));
      
      return '/' + segments.join('/');
    };
    
    // Handle STATE filter
    if (filterType === 'state') {
      const newStateSlug = generateSlug(value);
      // When state changes, clear city (city is dependent on state)
      const newUrl = buildNewUrl(newStateSlug, null, currentStream, currentCourse);
      window.location.href = newUrl; // Use full page navigation to ensure proper state update
      return;
    }
    
    // Handle CITY filter
    if (filterType === 'city') {
      const newCitySlug = generateSlug(value);
      // City can work with or without state
      const newUrl = buildNewUrl(currentState, newCitySlug, currentStream, currentCourse);
      window.location.href = newUrl; // Use full page navigation to ensure proper state update
      return;
    }
    
    // Handle STREAM filter
    if (filterType === 'stream' || filterType === 'subStream') {
      const newStreamSlug = generateSlug(value);
      const newUrl = buildNewUrl(currentState, currentCity, newStreamSlug, currentCourse);
      window.location.href = newUrl; // Use full page navigation to ensure proper state update
      return;
    }
    
    // Handle COURSE filter
    if (filterType === 'course') {
      const newCourseSlug = generateSlug(value);
      const newUrl = buildNewUrl(currentState, currentCity, currentStream, newCourseSlug);
      window.location.href = newUrl; // Use full page navigation to ensure proper state update
      return;
    }
    
    // Handle collegeType, accreditation as query params (not in path)
    if (filterType === 'collegeType') {
      const currentPath = location.pathname;
      const queryParams = new URLSearchParams(location.search);
      queryParams.set('type', generateSlug(value));
      window.location.href = `${currentPath}?${queryParams.toString()}`;
      return;
    }
    
    if (filterType === 'accreditation') {
      const currentPath = location.pathname;
      const queryParams = new URLSearchParams(location.search);
      queryParams.set('accreditation', ACCREDITATION_TO_SLUG[value] || generateSlug(value));
      window.location.href = `${currentPath}?${queryParams.toString()}`;
      return;
    }
    
    // Secondary filters - Query parameters (degreeType, examAccepted, affiliation, recognition)
    if (['degreeType', 'examAccepted', 'affiliation', 'recognition'].includes(filterType)) {
      const currentPath = location.pathname;
      const newUrl = buildUrlWithQueryParams(currentPath, { type: filterType, value });
      window.location.href = newUrl;
      return;
    }
    
    // For other filters - apply as local filter
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Toggle filter for Type - now navigates to URL
  const toggleFilter = (type) => {
    // If type is already selected (from URL), remove it by going back to base URL
    if (activeFilters.collegeType === type) {
      const baseSuffix = pageInfo.isUniversity ? 'university' : pageInfo.isSchools ? 'schools' : 'colleges';
      window.location.href = `/${baseSuffix}`;
      return;
    }
    // Otherwise, navigate to the type URL
    handleFilterSelect('collegeType', type);
  };

  const toggleCompare = (collegeId) => {
    setCompareList(prev => 
      prev.includes(collegeId) 
        ? prev.filter(id => id !== collegeId)
        : prev.length < 4 ? [...prev, collegeId] : prev
    );
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: [],
      city: '',
      state: '',
      minFees: '',
      maxFees: '',
      stream: '',
      subStream: '',
      degree: '',
      specialization: '',
      programType: '',
    });
    setActiveFilterDropdown(null);
    // Navigate to base URL to clear all URL-based filters
    const baseSuffix = pageInfo.isUniversity ? 'university' : pageInfo.isSchools ? 'schools' : 'colleges';
    window.location.href = `/${baseSuffix}`;
  };

  const removeFilter = (filterType) => {
    setFilters(prev => ({ ...prev, [filterType]: '' }));
  };
  
  // Remove a filter from URL and navigate to new URL
  const removeUrlFilter = (filterToRemove) => {
    const baseSuffix = pageInfo.isUniversity ? 'university' : pageInfo.isSchools ? 'schools' : 'colleges';
    
    // Get current filters from URL
    let newState = urlInfo.state;
    let newCity = urlInfo.city;
    let newStream = urlInfo.stream;
    let newCourse = urlInfo.course;
    
    // Remove the specified filter
    switch (filterToRemove) {
      case 'state':
        newState = null;
        newCity = null; // City is under state, so remove it too
        break;
      case 'city':
        newCity = null;
        break;
      case 'stream':
        newStream = null;
        newCourse = null; // Course is under stream, so remove it too
        break;
      case 'course':
        newCourse = null;
        break;
      default:
        break;
    }
    
    // Build new URL with remaining filters
    let segments = [baseSuffix];
    if (newState) segments.push(newState);
    if (newCity) segments.push(newCity); // City can be with state now
    if (newStream) segments.push(newStream);
    if (newCourse) segments.push(newCourse);
    
    // Handle query params for type, accreditation, degree, exam, affiliation, recognition
    const queryParams = new URLSearchParams(location.search);
    if (filterToRemove === 'collegeType') {
      queryParams.delete('type');
    }
    if (filterToRemove === 'accreditation') {
      queryParams.delete('accreditation');
    }
    if (filterToRemove === 'degreeType') {
      queryParams.delete('degree');
    }
    if (filterToRemove === 'examAccepted') {
      queryParams.delete('exam');
    }
    if (filterToRemove === 'affiliation') {
      queryParams.delete('affiliation');
    }
    if (filterToRemove === 'recognition') {
      queryParams.delete('recognition');
    }
    
    const newPath = '/' + segments.join('/');
    const queryString = queryParams.toString();
    window.location.href = queryString ? `${newPath}?${queryString}` : newPath;
  };
  
  // Breadcrumb generation - Updated for NEW URL structure
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Home', path: '/' }];
    
    if (urlInfo.type === 'institution-listing') {
      const isSchools = urlInfo.institutionType === 'schools';
      const isUniversity = urlInfo.institutionType === 'university';
      const typeName = isSchools ? 'Schools' : isUniversity ? 'Universities' : 'Colleges';
      const basePath = `/${urlInfo.institutionType}`;
      
      // Always add base institution type
      crumbs.push({ label: `All ${typeName} in India`, path: basePath });
      
      // Add state if present
      if (urlInfo.state) {
        const statePath = `${basePath}/${urlInfo.state}`;
        crumbs.push({ label: `${getStateName(urlInfo.state)} ${typeName}`, path: statePath });
      }
      
      // Add city if present (only if different path from state)
      if (urlInfo.city) {
        const cityPath = urlInfo.state 
          ? `${basePath}/${urlInfo.state}/${urlInfo.city}` 
          : `${basePath}/${urlInfo.city}`;
        crumbs.push({ label: `${getCityName(urlInfo.city)} ${typeName}`, path: cityPath });
      }
      
      // Add stream if present
      if (urlInfo.stream) {
        const streamName = getStreamName(urlInfo.stream);
        crumbs.push({ label: `${streamName} ${typeName}`, path: location.pathname });
      }
      
      // Add course if present
      if (urlInfo.course) {
        const courseName = getCourseName(urlInfo.course);
        crumbs.push({ label: `${courseName} ${typeName}`, path: location.pathname });
      }
    }
    
    return crumbs;
  }, [urlInfo, location.pathname]);

  // Determine institution type for filter labels and visibility
  const filterConfig = useMemo(() => {
    const isSchools = urlInfo.institutionType === 'schools';
    const isUniversity = urlInfo.institutionType === 'university';
    
    return {
      label: isSchools ? 'Filter Schools' : isUniversity ? 'Filter Universities' : 'Filter Colleges',
      showStream: !isSchools, // Hide stream for schools
      showCourse: !isSchools, // Hide course for schools
      showDegreeType: !isSchools, // Hide degree type for schools
      showExamAccepted: !isSchools, // Hide exam accepted for schools
      showCollegeType: true, // Show for all (Government/Private)
      showAccreditation: !isSchools, // Hide accreditation for schools
      showAffiliation: !isSchools, // Hide affiliation for schools
      showRecognition: !isSchools, // Hide recognition for schools
      showState: true, // Show for all
      showCity: true, // Show for all
      // School-specific filters (future enhancement)
      showBoard: isSchools,
      showMedium: isSchools,
      showClasses: isSchools,
    };
  }, [urlInfo.institutionType]);

  // Helper function to replace hardcoded years with dynamic year
  // This is used ONLY for pageContent from database which may have old hardcoded years
  const replaceYear = (text) => {
    if (!text) return text;
    // Only replace 2024 and 2025 with relative years
    // Don't replace current year or future years
    const currentRealYear = new Date().getFullYear();
    return text
      .replace(/2024/g, String(year - 1))  // Replace old hardcoded 2024 with previous year
      .replace(/2025/g, String(year));      // Replace old hardcoded 2025 with current admission year
    // Don't replace 2026 or later - those are likely intentional
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{pageContent?.meta_title ? replaceYear(pageContent.meta_title) : pageInfo.title} | admissionbuddy</title>
        <meta name="description" content={pageContent?.meta_description ? replaceYear(pageContent.meta_description) : pageInfo.description} />
        <link rel="canonical" href={pageContent?.canonical_url || `https://admissionbuddy.co${location.pathname}`} />
        {pageContent?.meta_keywords?.length > 0 && (
          <meta name="keywords" content={pageContent.meta_keywords.join(', ')} />
        )}
      </Helmet>
      
      {/* HERO SECTION - Modern Design */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-4">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-blue-400">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-white font-medium">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-white transition-colors">{crumb.label}</Link>
                )}
              </React.Fragment>
            ))}
          </div>
          
          {/* Title & Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {pageContent?.page_title ? replaceYear(pageContent.page_title) : pageInfo.title}
              </h1>
              {pageContent?.page_subtitle && (
                <p className="text-blue-200 text-sm md:text-base max-w-2xl">{replaceYear(pageContent.page_subtitle)}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  <strong>{totalCount.toLocaleString()}</strong> {pageInfo.isSchools ? 'Schools' : pageInfo.isUniversity ? 'Universities' : 'Colleges'} Found
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5">
                  <FiCheckCircle className="text-green-400" />
                  Verified Information
                </span>
              </div>
            </div>
            
            {/* Author Info - Compact */}
            <AuthorInfoHero
              name={pageContent?.updated_by_name || pageContent?.created_by_name}
              photo={pageContent?.updated_by_photo || pageContent?.created_by_photo}
              updatedAt={pageContent?.updated_at}
              createdAt={pageContent?.created_at}
              label="Curated by"
            />
          </div>
        </div>
      </div>

      {/* QUICK ACTION CARDS - Dynamic from Admin Settings */}
      {quickActionSettings?.is_enabled && quickActionSettings?.cards?.filter(c => c.is_enabled).length > 0 && (
        (() => {
          // Check if should show on this page type
          const instType = (pageInfo.institutionType || '').toLowerCase();
          const showOnPage = 
            ((instType === 'college' || instType === 'colleges') && quickActionSettings.show_on_college_listing) ||
            ((instType === 'school' || instType === 'schools') && quickActionSettings.show_on_school_listing) ||
            ((instType === 'university' || instType === 'universities') && quickActionSettings.show_on_university_listing);
          
          if (!showOnPage) return null;
          
          const getIconComponent = (iconName) => {
            const icons = { edit: FiEdit3, grid: FiGrid, target: FiTarget, star: FiStar, book: FiBookOpen, award: FiAward, heart: FiHeart };
            return icons[iconName] || FiStar;
          };
          
          // Map gradient names to actual CSS colors
          const gradientColors = {
            'orange-500': '#f97316', 'red-500': '#ef4444', 'blue-500': '#3b82f6', 'cyan-500': '#06b6d4',
            'emerald-500': '#10b981', 'teal-500': '#14b8a6', 'purple-500': '#a855f7', 'pink-500': '#ec4899',
            'yellow-500': '#eab308', 'indigo-500': '#6366f1', 'rose-500': '#f43f5e', 'green-500': '#22c55e'
          };
          
          const enabledCards = quickActionSettings.cards.filter(c => c.is_enabled).sort((a, b) => (a.order || 0) - (b.order || 0));
          
          return (
            <div className="bg-white border-b shadow-sm">
              <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {enabledCards.slice(0, 3).map(card => {
                    // Advertisement Slot
                    if (card.is_ad_slot && card.ad_image_url) {
                      return (
                        <a key={card.id} href={card.ad_click_url || '#'} target="_blank" rel="noopener noreferrer" className="group">
                          <div className="rounded-xl overflow-hidden h-full hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            <img loading="lazy" src={card.ad_image_url} alt={card.ad_alt_text || 'Advertisement'} className="w-full h-16 md:h-20 object-cover" />
                          </div>
                        </a>
                      );
                    }
                    
                    // Regular Action Card with inline gradient
                    const IconComponent = getIconComponent(card.icon);
                    const fromColor = gradientColors[card.gradient_from] || '#3b82f6';
                    const toColor = gradientColors[card.gradient_to] || '#06b6d4';
                    
                    return (
                      <Link key={card.id} to={card.link || '/'} className="group">
                        <div 
                          style={{ background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})` }}
                          className="rounded-xl p-3 md:p-4 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all h-full"
                        >
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                              <IconComponent className="text-xl md:text-2xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-sm md:text-base truncate">{card.title}</h3>
                              <p className="text-[10px] md:text-xs opacity-80">{card.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()
      )}
      
      {/* Fallback: Show default cards if settings not loaded */}
      {!quickActionSettings && (
        <div className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <Link to="/write-review" className="group">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 md:p-4 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all h-full">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiEdit3 className="text-xl md:text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm md:text-base truncate">Write a Review</h3>
                      <p className="text-[10px] md:text-xs text-orange-100">Get Upto ₹300*</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/course-finder" className="group">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 md:p-4 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all h-full">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiGrid className="text-xl md:text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm md:text-base truncate">Course Finder</h3>
                      <p className="text-[10px] md:text-xs text-blue-100">Find Your Course</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/college-predictor" className="group">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-3 md:p-4 text-white hover:shadow-xl hover:-translate-y-0.5 transition-all h-full">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <FiTarget className="text-xl md:text-2xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm md:text-base truncate">Predictor</h3>
                      <p className="text-[10px] md:text-xs text-emerald-100">Admission Chances</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT SECTIONS - Only show if admin content is configured */}
      {pageContent?.introduction && (
        <div className="bg-white py-4 md:py-6">
          <div className="container mx-auto px-4 md:px-6">
            <section className="mb-4">
              <div className="text-gray-700 text-sm md:text-base leading-relaxed">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: pageContent.introduction }}
                />
              </div>
              
              {/* READ MORE BUTTON - Show when collapsed and there's SEO TOC content */}
              {!showContent && (pageContent.seo_toc?.length > 0) && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowContent(true)}
                    className="inline-flex items-center gap-2 px-6 py-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium rounded-full transition-all"
                  >
                    <span>Read More</span>
                    <FiChevronDown size={18} />
                  </button>
                </div>
              )}
              
              {/* EXPANDED SEO CONTENT - Show when Read More is clicked */}
              {showContent && pageContent.seo_toc?.length > 0 && (
                <div className="mt-6 space-y-8">
                  {/* TABLE OF CONTENTS */}
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
                      {pageContent.seo_toc.map((section, idx) => (
                        <a
                          key={`toc-${idx}`}
                          href={`#${section.anchor || `section-${idx}`}`}
                          className="text-left text-sm text-orange-600 hover:underline flex gap-2"
                        >
                          <span className="font-semibold flex-shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                          <span>{section.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  
                  {/* SEO TOC SECTIONS (Visual Block Editor Content) */}
                  <div className="space-y-8">
                    {pageContent.seo_toc.map((tocSection, sectionIdx) => (
                      <section key={sectionIdx} id={tocSection.anchor || `section-${sectionIdx}`} className="scroll-mt-40">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{tocSection.title}</h2>
                        
                        {/* Render blocks */}
                        {tocSection.blocks?.map((block, blockIdx) => (
                          <div key={blockIdx} className="mb-4">
                            {/* Text Block */}
                            {block.type === 'text' && (
                              <div className="prose max-w-none">
                                {block.heading && <h3 className="text-xl font-semibold mb-2">{block.heading}</h3>}
                                <div dangerouslySetInnerHTML={{ __html: block.content || '' }} />
                              </div>
                            )}
                            
                            {/* Image Block */}
                            {block.type === 'image' && block.url && (
                              <figure style={{ width: block.width || '100%' }} className="mx-auto">
                                <img loading="lazy" src={block.url} alt={block.alt || ''} title={block.title || ''} className="rounded-lg w-full" />
                                {block.caption && <figcaption className="text-center text-sm text-gray-600 mt-2">{block.caption}</figcaption>}
                              </figure>
                            )}
                            
                            {/* Video Block */}
                            {block.type === 'video' && block.url && (() => {
                              const match = block.url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
                              if (match) {
                                return (
                                  <div className="relative" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                      src={`https://www.youtube.com/embed/${match[1]}`}
                                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                                      title={block.title || 'Video'}
                                      allowFullScreen
                                    />
                                  </div>
                                );
                              }
                              return null;
                            })()}
                            
                            {/* Table Block */}
                            {block.type === 'table' && (
                              <div className="overflow-x-auto">
                                {block.title && <h4 className="font-semibold mb-2">{block.title}</h4>}
                                <table className="w-full border-collapse border border-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      {block.headers?.map((h, hi) => (
                                        <th key={hi} className="border border-gray-200 px-4 py-2 text-left font-semibold">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {block.rows?.map((row, ri) => (
                                      <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {row?.map((cell, ci) => (
                                          <td key={ci} className="border border-gray-200 px-4 py-2">{cell}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                            
                            {/* List Block */}
                            {block.type === 'list' && (
                              <div>
                                {block.title && <h4 className="font-semibold mb-2">{block.title}</h4>}
                                {block.listType === 'number' ? (
                                  <ol className="list-decimal list-inside space-y-1">
                                    {block.items?.map((item, li) => (
                                      <li key={li} className="text-gray-700">{item}</li>
                                    ))}
                                  </ol>
                                ) : block.listType === 'check' ? (
                                  <ul className="space-y-1">
                                    {block.items?.map((item, li) => (
                                      <li key={li} className="flex items-start gap-2 text-gray-700">
                                        <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <ul className="list-disc list-inside space-y-1">
                                    {block.items?.map((item, li) => (
                                      <li key={li} className="text-gray-700">{item}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </section>
                    ))}
                  </div>
                  
                  {/* READ LESS BUTTON */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowContent(false)}
                      className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-400 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-full transition-all"
                    >
                      <span>Read Less</span>
                      <FiChevronUp size={18} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Ad Banner - Above Filters */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4 md:px-6">
          <AdBanner pageName="colleges" position="top" />
        </div>
      </div>

      {/* Sponsored Ads Section - URL Aware */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <UrlAwareSponsoredSection sectionType="featured" />
          <UrlAwareSponsoredSection sectionType="admission" />
        </div>
      </div>

      {/* COLLEGE LISTING SECTION */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 md:px-6">
          {/* HORIZONTAL FILTER BAR */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6 relative border border-gray-100">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                <FiFilter className="text-blue-600" />
                {filterConfig.label}
              </h3>
              {(activeFilters.stream || activeFilters.state || activeFilters.city || activeFilters.collegeType || activeFilters.accreditation) && (
                <button 
                  onClick={clearFilters}
                  className="text-xs text-red-500 hover:text-red-600 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            
            {/* Primary Filters Row */}
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all"
              >
                <FiFilter size={14} />
                All Filters
              </button>
              
              {/* Stream Filter - Hide for Schools */}
              {filterConfig.showStream && (
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'subStream' ? null : 'subStream')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.stream || activeFilters.subStream 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.stream || activeFilters.subStream || 'Stream'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'subStream' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'subStream' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border py-2 z-50 max-h-60 overflow-y-auto">
                    {filterOptions.subStream.map((option) => (
                      <button 
                        key={option} 
                        onClick={() => handleFilterSelect('subStream', option)} 
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${
                          activeFilters.stream === option || activeFilters.subStream === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option} {(activeFilters.stream === option || activeFilters.subStream === option) && '✓'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              )}
              
              {/* State Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'state' ? null : 'state')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.state 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.state || 'State'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'state' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'state' && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input 
                        type="text"
                        placeholder="Search state..."
                        className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const searchVal = e.target.value.toLowerCase();
                          const dropdown = e.target.closest('.relative').querySelector('.state-options');
                          if (dropdown) {
                            dropdown.querySelectorAll('button').forEach(btn => {
                              btn.style.display = btn.textContent.toLowerCase().includes(searchVal) ? 'block' : 'none';
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="state-options max-h-48 overflow-y-auto py-1">
                      {filterOptions.state.map((option) => (
                        <button 
                          key={option} 
                          onClick={() => handleFilterSelect('state', option)} 
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${
                            activeFilters.state === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {option} {activeFilters.state === option && '✓'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* City Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'city' ? null : 'city')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.city 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.city || 'City'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'city' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'city' && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border z-50">
                    {/* Search Input */}
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder="Search cities..."
                        value={cityFilterSearch}
                        onChange={(e) => setCityFilterSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    {activeFilters.state && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">
                        Cities in {activeFilters.state}
                      </div>
                    )}
                    <div className="max-h-60 overflow-y-auto py-2">
                      {filterOptions.city
                        .filter(city => city.toLowerCase().includes(cityFilterSearch.toLowerCase()))
                        .slice(0, 100) // Limit to 100 cities for performance
                        .length > 0 ? (
                        filterOptions.city
                          .filter(city => city.toLowerCase().includes(cityFilterSearch.toLowerCase()))
                          .slice(0, 100)
                          .map((option) => (
                          <button 
                            key={option} 
                            onClick={() => {
                              handleFilterSelect('city', option);
                              setCityFilterSearch('');
                            }} 
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${
                              activeFilters.city === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                            }`}
                          >
                            {option} {activeFilters.city === option && '✓'}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No cities found</div>
                      )}
                    </div>
                    {filterOptions.city.filter(city => city.toLowerCase().includes(cityFilterSearch.toLowerCase())).length > 100 && (
                      <div className="px-4 py-2 text-xs text-gray-400 border-t bg-gray-50">
                        Type to search more cities...
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* College/School/University Type Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'collegeType' ? null : 'collegeType')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.collegeType 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.collegeType || (urlInfo.institutionType === 'schools' ? 'Type Of School' : urlInfo.institutionType === 'university' ? 'Type Of University' : 'Type Of College')}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'collegeType' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'collegeType' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border py-2 z-50 max-h-60 overflow-y-auto">
                    {filterOptions.collegeType.map((option) => (
                      <button key={option} onClick={() => toggleFilter(option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 ${activeFilters.collegeType === option ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {activeFilters.collegeType === option && '✓'}</button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Course Filter - Hide for Schools */}
              {filterConfig.showCourse && (
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'course' ? null : 'course')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    filters.course 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {filters.course || 'Course'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'course' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'course' && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input 
                        type="text"
                        placeholder="Search course..."
                        className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const searchVal = e.target.value.toLowerCase();
                          const dropdown = e.target.closest('.relative').querySelector('.filter-options');
                          if (dropdown) {
                            dropdown.querySelectorAll('button').forEach(btn => {
                              btn.style.display = btn.textContent.toLowerCase().includes(searchVal) ? 'block' : 'none';
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="filter-options max-h-48 overflow-y-auto py-1">
                      {filterOptions.course.map((option) => (
                        <button key={option} onClick={() => handleFilterSelect('course', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${filters.course === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {filters.course === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}
              
              {/* Degree Type Filter - Hide for Schools */}
              {filterConfig.showDegreeType && (
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'degreeType' ? null : 'degreeType')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.degreeType 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.degreeType || 'Degree Type'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'degreeType' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'degreeType' && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border py-2 z-50 max-h-60 overflow-y-auto">
                    {filterOptions.degreeType.map((option) => (
                      <button key={option} onClick={() => handleFilterSelect('degreeType', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${activeFilters.degreeType === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {activeFilters.degreeType === option && '✓'}</button>
                    ))}
                  </div>
                )}
              </div>
              )}
              
              {/* Exam Accepted Filter - Hide for Schools */}
              {filterConfig.showExamAccepted && (
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'examAccepted' ? null : 'examAccepted')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.examAccepted 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.examAccepted || 'Exam Accepted'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'examAccepted' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'examAccepted' && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input 
                        type="text"
                        placeholder="Search exam..."
                        className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const searchVal = e.target.value.toLowerCase();
                          const dropdown = e.target.closest('.relative').querySelector('.filter-options');
                          if (dropdown) {
                            dropdown.querySelectorAll('button').forEach(btn => {
                              btn.style.display = btn.textContent.toLowerCase().includes(searchVal) ? 'block' : 'none';
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="filter-options max-h-48 overflow-y-auto py-1">
                      {filterOptions.examAccepted.map((option) => (
                        <button key={option} onClick={() => handleFilterSelect('examAccepted', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${activeFilters.examAccepted === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {activeFilters.examAccepted === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}
              
              {/* Affiliation Filter - Hide for Schools */}
              {filterConfig.showAffiliation && (
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'affiliation' ? null : 'affiliation')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.affiliation 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.affiliation ? activeFilters.affiliation.split(' ')[0] : 'Affiliation'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'affiliation' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'affiliation' && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input 
                        type="text"
                        placeholder="Search affiliation..."
                        className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const searchVal = e.target.value.toLowerCase();
                          const dropdown = e.target.closest('.relative').querySelector('.filter-options');
                          if (dropdown) {
                            dropdown.querySelectorAll('button').forEach(btn => {
                              btn.style.display = btn.textContent.toLowerCase().includes(searchVal) ? 'block' : 'none';
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="filter-options max-h-48 overflow-y-auto py-1">
                      {filterOptions.affiliation.map((option) => (
                        <button key={option} onClick={() => handleFilterSelect('affiliation', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${activeFilters.affiliation === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {activeFilters.affiliation === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}
              
              {/* Recognition Filter - Hide for Schools */}
              {filterConfig.showRecognition && (
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'recognition' ? null : 'recognition')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.recognition 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.recognition ? activeFilters.recognition.split(' ')[0] : 'Recognition'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'recognition' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'recognition' && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input 
                        type="text"
                        placeholder="Search recognition..."
                        className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const searchVal = e.target.value.toLowerCase();
                          const dropdown = e.target.closest('.relative').querySelector('.filter-options');
                          if (dropdown) {
                            dropdown.querySelectorAll('button').forEach(btn => {
                              btn.style.display = btn.textContent.toLowerCase().includes(searchVal) ? 'block' : 'none';
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="filter-options max-h-48 overflow-y-auto py-1">
                      {filterOptions.recognition.map((option) => (
                        <button key={option} onClick={() => handleFilterSelect('recognition', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${activeFilters.recognition === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {activeFilters.recognition === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}
              
              {/* Accreditation Filter - SEO URL - Hide for Schools */}
              {filterConfig.showAccreditation && (
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'accreditation' ? null : 'accreditation')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.accreditation 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.accreditation || 'Accreditation'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'accreditation' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'accreditation' && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-2 border-b sticky top-0 bg-white">
                      <input 
                        type="text"
                        placeholder="Search accreditation..."
                        className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const searchVal = e.target.value.toLowerCase();
                          const dropdown = e.target.closest('.relative').querySelector('.filter-options');
                          if (dropdown) {
                            dropdown.querySelectorAll('button').forEach(btn => {
                              btn.style.display = btn.textContent.toLowerCase().includes(searchVal) ? 'block' : 'none';
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="filter-options max-h-48 overflow-y-auto py-1">
                      {filterOptions.accreditation.map((option) => (
                        <button key={option} onClick={() => handleFilterSelect('accreditation', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${activeFilters.accreditation === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {activeFilters.accreditation === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
            
            {/* Applied Filters Row - Only show if filters are active */}
            {(activeFilters.stream || activeFilters.state || activeFilters.city || activeFilters.collegeType || activeFilters.accreditation || activeFilters.course || activeFilters.degreeType || activeFilters.examAccepted || activeFilters.affiliation || activeFilters.recognition) && (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">Applied Filters:</span>
                  
                  {/* Show active URL-based filters */}
                  {activeFilters.stream && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                      {activeFilters.stream}
                      <button onClick={() => removeUrlFilter('stream')} className="hover:bg-blue-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {activeFilters.state && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      {activeFilters.state}
                      <button onClick={() => removeUrlFilter('state')} className="hover:bg-green-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {activeFilters.city && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                      {activeFilters.city}
                      <button onClick={() => removeUrlFilter('city')} className="hover:bg-purple-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Show Type from URL */}
                  {activeFilters.collegeType && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
                      {activeFilters.collegeType}
                      <button onClick={() => removeUrlFilter('collegeType')} className="hover:bg-orange-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Show Accreditation from URL */}
                  {activeFilters.accreditation && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">
                      {activeFilters.accreditation}
                      <button onClick={() => removeUrlFilter('accreditation')} className="hover:bg-teal-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Course filter */}
                  {activeFilters.course && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
                      {activeFilters.course}
                      <button onClick={() => removeUrlFilter('course')} className="hover:bg-indigo-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Degree Type filter - from URL query params */}
                  {activeFilters.degreeType && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium">
                      {activeFilters.degreeType}
                      <button onClick={() => removeUrlFilter('degreeType')} className="hover:bg-pink-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Exam Accepted filter - from URL query params */}
                  {activeFilters.examAccepted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
                      {activeFilters.examAccepted}
                      <button onClick={() => removeUrlFilter('examAccepted')} className="hover:bg-yellow-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Affiliation filter - from URL query params */}
                  {activeFilters.affiliation && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium">
                      {activeFilters.affiliation}
                      <button onClick={() => removeUrlFilter('affiliation')} className="hover:bg-cyan-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Recognition filter - from URL query params */}
                  {activeFilters.recognition && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium">
                      {activeFilters.recognition}
                      <button onClick={() => removeUrlFilter('recognition')} className="hover:bg-rose-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* MAIN LISTING */}
          <main>
            {/* Top Controls Bar */}
            <div className="mb-5 flex flex-wrap justify-between items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FiAward className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {loading ? 'Loading...' : `${totalCount.toLocaleString()} ${pageInfo.isSchools ? 'Schools' : 'Colleges'}`}
                  </h3>
                  <p className="text-xs text-gray-500">Ranked by popularity & reviews</p>
                </div>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white font-medium text-gray-700"
              >
                <option value="ranking">Sort by: Ranking</option>
                <option value="fees-low">Fees: Low to High</option>
                <option value="fees-high">Fees: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            {/* Compare Bar */}
            {compareList.length > 0 && (
              <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {compareList.length}
                    </div>
                    <span className="font-semibold text-gray-900">colleges selected for comparison</span>
                    <Button size="sm" onClick={() => window.open(`/compare?ids=${compareList.join(',')}`, '_blank')} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Compare Now →
                    </Button>
                  </div>
                  <button onClick={() => setCompareList([])} className="text-sm text-gray-600 hover:text-red-500 font-medium">Clear</button>
                </div>
              </div>
            )}

            {/* COLLEGE LIST - CollegeDunia Style with Featured Sections */}
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Finding the best colleges for you...</p>
              </div>
            ) : institutions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-900 text-xl font-bold mb-2">No {pageInfo.isSchools ? 'schools' : pageInfo.isUniversity ? 'universities' : 'colleges'} found</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white">Clear All Filters</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {institutions.map((inst, idx) => (
                  <React.Fragment key={inst.id || idx}>
                    {/* Featured Section - Appears after colleges 3, 9, 15, etc. (Only if featured colleges exist) */}
                    {idx > 0 && idx % 3 === 0 && idx % 6 !== 0 && featuredColleges.length > 0 && (
                      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-xl border-2 border-orange-200 overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 flex items-center gap-2">
                          <FiStar className="text-white fill-current" size={14} />
                          <span className="text-white font-bold text-sm">Featured {pageInfo.isSchools ? 'Schools' : pageInfo.isUniversity ? 'Universities' : 'Colleges'}</span>
                          <span className="text-orange-100 text-xs ml-auto">Sponsored</span>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {featuredColleges.slice(0, 3).map((featured, fIdx) => (
                              <Link 
                                key={featured.id || fIdx}
                                to={getInstitutionDetailUrl(featured.institution_type || 'college', featured.id, featured.name, featured.location?.city, featured.serial_number)}
                                className={`bg-white rounded-lg p-4 border border-orange-100 hover:shadow-md hover:border-orange-300 transition-all ${fIdx === 2 ? 'hidden md:block' : ''}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                                    fIdx === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                                    fIdx === 1 ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                                    'bg-gradient-to-br from-emerald-100 to-emerald-200'
                                  }`}>
                                    {featured.logo_url ? (
                                      <img loading="lazy" src={featured.logo_url} alt={featured.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span className={`text-lg font-bold ${
                                        fIdx === 0 ? 'text-blue-600' :
                                        fIdx === 1 ? 'text-purple-600' :
                                        'text-emerald-600'
                                      }`}>{featured.name?.charAt(0)}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{featured.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {featured.location?.city}{featured.location?.state ? `, ${featured.location.state}` : ''}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      {featured.type && (
                                        <span className={`text-xs px-2 py-0.5 rounded ${
                                          featured.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                        }`}>{featured.type}</span>
                                      )}
                                      {featured.nirf_ranking && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">NIRF #{featured.nirf_ranking}</span>
                                      )}
                                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-0.5">
                                        <FiStar size={10} className="fill-current" /> {(featured.rating || 0).toFixed(1)}
                                      </span>
                                    </div>
                                    <span className="text-xs text-orange-600 font-medium mt-2 inline-block">Apply Now →</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="text-center mt-4">
                            <Link to={pageInfo.isSchools ? '/schools' : pageInfo.isUniversity ? '/university' : '/featured-colleges'} className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1">
                              View All Featured {pageInfo.isSchools ? 'Schools' : pageInfo.isUniversity ? 'Universities' : 'Colleges'} <FiArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Admissions Open Section - Appears after colleges 6, 12, 18, etc. (Only if admission open colleges exist) */}
                    {idx > 0 && idx % 6 === 0 && admissionOpenColleges.length > 0 && (
                      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl border-2 border-green-200 overflow-hidden shadow-lg">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 flex items-center gap-2">
                          <FiCheckCircle className="text-white" size={14} />
                          <span className="text-white font-bold text-sm">Admissions Open {year}</span>
                          <span className="text-green-100 text-xs ml-auto">Apply Now</span>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {admissionOpenColleges.slice(0, 3).map((college, aIdx) => (
                              <Link 
                                key={college.id || aIdx}
                                to={getInstitutionDetailUrl(college.institution_type || 'college', college.id, college.name, college.location?.city, college.serial_number)}
                                className={`bg-white rounded-lg p-4 border border-green-100 hover:shadow-md hover:border-green-300 transition-all ${aIdx === 2 ? 'hidden md:block' : ''}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                                    aIdx === 0 ? 'bg-gradient-to-br from-green-100 to-green-200' :
                                    aIdx === 1 ? 'bg-gradient-to-br from-teal-100 to-teal-200' :
                                    'bg-gradient-to-br from-emerald-100 to-emerald-200'
                                  }`}>
                                    {college.logo_url ? (
                                      <img loading="lazy" src={college.logo_url} alt={college.name} className="w-full h-full object-contain p-1" />
                                    ) : (
                                      <span className={`text-lg font-bold ${
                                        aIdx === 0 ? 'text-green-600' :
                                        aIdx === 1 ? 'text-teal-600' :
                                        'text-emerald-600'
                                      }`}>{college.name?.charAt(0)}</span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{college.name}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {college.location?.city}{college.location?.state ? `, ${college.location.state}` : ''}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                                        Admissions Open
                                      </span>
                                      {college.average_fees > 0 && (
                                        <span className="text-xs text-gray-600">
                                          ₹{college.average_fees >= 100000 ? `${(college.average_fees / 100000).toFixed(1)}L` : `${(college.average_fees / 1000).toFixed(0)}K`}/yr
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-green-600 font-medium mt-2 inline-block">Apply Now →</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="text-center mt-4">
                            <Link to="/admissions-open" className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1">
                              View All Colleges with Open Admissions <FiArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Regular College Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-200 group">
                    {/* Top Badge Bar */}
                    {(inst.is_featured || inst.is_admission_open || inst.nirf_ranking || inst.is_admission_partner || inst.is_no_cost_emi) && (
                      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-3 md:px-4 py-2 flex items-center gap-1.5 md:gap-2 flex-wrap border-b border-gray-100">
                        {inst.nirf_ranking && (
                          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            🏆 Rank #{inst.nirf_ranking}
                          </span>
                        )}
                        {inst.is_featured && (
                          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <FiStar size={10} className="fill-current" /> Featured
                          </span>
                        )}
                        {inst.is_admission_partner && (
                          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            🤝 Partner
                          </span>
                        )}
                        {inst.is_no_cost_emi && (
                          <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            💳 EMI
                          </span>
                        )}
                        {inst.is_admission_open && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            ✓ Open
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="p-3 md:p-4">
                      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        {/* Logo & Basic Info */}
                        <div className="flex gap-3 flex-1">
                          {/* Logo */}
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-gray-100 group-hover:border-blue-200 transition-colors shadow-sm">
                            {inst.logo_url ? (
                              <img loading="lazy" src={inst.logo_url} alt={`${inst.name} logo`} className="w-full h-full object-contain p-1.5" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">${inst.name?.charAt(0) || 'C'}</span>`; }} />
                            ) : (
                              <span className="text-xl md:text-2xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{inst.name?.charAt(0)}</span>
                            )}
                          </div>
                          
                          {/* College Info */}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                              className="font-semibold text-sm md:text-base text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors leading-snug"
                            >
                              {inst.name}
                            </Link>
                            <div className="flex items-center gap-1.5 md:gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <FiMapPin size={11} className="text-gray-400" />
                                <span className="truncate max-w-[120px] md:max-w-none">{inst.location?.city}{inst.location?.state ? `, ${inst.location.state}` : ''}</span>
                              </span>
                              {inst.type && (
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                  inst.type === 'Government' ? 'bg-blue-50 text-blue-600' : 
                                  inst.type === 'Private' ? 'bg-purple-50 text-purple-600' : 
                                  'bg-gray-50 text-gray-600'
                                }`}>
                                  {inst.type}
                                </span>
                              )}
                              {inst.is_verified && (
                                <span className="flex items-center gap-0.5 text-green-600 text-xs">
                                  <FiCheckCircle size={11} />
                                </span>
                              )}
                            </div>
                            
                            {/* Stats Row - Desktop */}
                            <div className="hidden md:flex items-center gap-4 mt-2.5 text-sm">
                              {inst.average_fees > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-400 text-xs">Fees:</span>
                                  <span className="font-semibold text-gray-800">
                                    ₹{inst.average_fees >= 100000 ? `${(inst.average_fees / 100000).toFixed(1)}L` : `${(inst.average_fees / 1000).toFixed(0)}K`}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <FiStar size={12} className="text-yellow-500 fill-current" />
                                <span className="font-semibold text-gray-800">{(inst.rating || 0).toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Rating & Actions - Desktop */}
                        <div className="hidden md:flex flex-col items-end justify-between gap-2 min-w-[130px]">
                          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg border border-green-200">
                            <FiStar size={14} className="fill-current text-green-500" />
                            <span className="font-bold text-base">{(inst.rating || 0).toFixed(1)}</span>
                            <span className="text-xs text-green-600">/5</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => toggleCompare(inst.id)}
                              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                                compareList.includes(inst.id) 
                                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                  : 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                              }`}
                            >
                              <FiBookmark size={14} className={compareList.includes(inst.id) ? 'fill-current' : ''} />
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); setSelectedCollege(inst); setApplyModalOpen(true); }}
                              className="px-3 py-2 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-all flex items-center gap-1"
                            >
                              <FiSend size={11} /> Apply
                            </button>
                            <Link 
                              to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-all flex items-center gap-1"
                            >
                              View <FiArrowRight size={11} />
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Stats & CTA */}
                      <div className="md:hidden mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs">
                            {inst.average_fees > 0 && (
                              <span className="text-gray-700 bg-gray-50 px-2 py-1 rounded">
                                ₹{inst.average_fees >= 100000 ? `${(inst.average_fees / 100000).toFixed(1)}L` : `${(inst.average_fees / 1000).toFixed(0)}K`}
                              </span>
                            )}
                            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                              <FiStar size={10} className="fill-current" /> {(inst.rating || 0).toFixed(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => { e.preventDefault(); setSelectedCollege(inst); setApplyModalOpen(true); }}
                              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium"
                            >
                              Apply
                            </button>
                            <Link 
                              to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium"
                            >
                              View →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="py-8">
              {loadingMore && (
                <div className="flex justify-center items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
                  <span className="text-gray-600 font-medium">Loading more colleges...</span>
                </div>
              )}
              
              {!hasMore && institutions.length > 0 && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full text-gray-600">
                    <FiCheckCircle className="text-green-500" size={18} />
                    <span className="font-medium">You&apos;ve seen all {totalCount.toLocaleString()} colleges</span>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Apply Now Modal */}
      <ApplyNowModal
        isOpen={applyModalOpen}
        onClose={() => { setApplyModalOpen(false); setSelectedCollege(null); }}
        collegeId={selectedCollege?.id}
        collegeName={selectedCollege?.name}
        collegeLogoUrl={selectedCollege?.logo_url}
        collegeCourses={selectedCollege?.courses?.map(c => typeof c === 'object' ? c.name : c) || []}
        source="listing_page"
        isSchool={selectedCollege?.institution_type === 'School'}
      />
    </div>
  );
};

export default DynamicListingPage;
