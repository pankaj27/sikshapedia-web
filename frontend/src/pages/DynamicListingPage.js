import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Link } from '../components/CustomLink';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiStar, FiBookmark, FiArrowRight, FiX, FiEdit3, FiGrid, FiTarget, FiUser, FiCheckCircle, FiAward, FiBookOpen, FiHeart, FiSend } from 'react-icons/fi';
import api from '../api/axios';
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
  
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  
  // Parse URL using new URL structure
  const urlInfo = useMemo(() => parseInstitutionUrl(location.pathname), [location.pathname]);
  
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
      
      // Build title based on filters
      let titleParts = [];
      
      // Add course if present
      if (urlInfo.filters.course) {
        titleParts.push(urlInfo.filters.course);
      }
      
      // Add stream if present
      if (urlInfo.filters.stream) {
        titleParts.push(urlInfo.filters.stream);
      }
      
      titleParts.push(typeName);
      
      // Add location
      if (urlInfo.filters.city && urlInfo.filters.state) {
        titleParts.push(`in ${urlInfo.filters.city}, ${urlInfo.filters.state}`);
      } else if (urlInfo.filters.city) {
        titleParts.push(`in ${urlInfo.filters.city}`);
      } else if (urlInfo.filters.state) {
        titleParts.push(`in ${urlInfo.filters.state}`);
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
        title: `Top ${titleParts.join(' ')} 2025`,
        description: generateMetaDescription(urlInfo),
        institutionTypes: institutionTypes,
        institutionType: urlInfo.institutionType,
        stream: urlInfo.stream,
        course: urlInfo.course,
        state: urlInfo.state,
        city: urlInfo.city,
        location: urlInfo.city || urlInfo.state,
        locationType: urlInfo.city ? 'city' : urlInfo.state ? 'state' : null,
        filters: urlInfo.filters,
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
        title: `Top ${titleParts.join(' ')} 2025`,
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
      title: 'Top Colleges in India 2025',
      description: 'Explore top institutions in India',
      institutionTypes: ['College', 'University'],
      isSchools: false
    };
  }, [urlInfo]);
  
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
    };
    
    // Use pageInfo filters from new URL structure
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
    
    return active;
  }, [pageInfo]);
  
  // All Indian States
  const allStates = [
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

  // Get cities based on selected state
  const getAvailableCities = () => {
    if (activeFilters.state) {
      return citiesByState[activeFilters.state] || [];
    }
    // If no state selected, show major cities from all states
    return ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Bhopal', 'Patna'];
  };

  // Filter options
  const filterOptions = {
    // Stream/Sub Stream
    subStream: [
      'Engineering', 'Medical', 'Management', 'Law', 'Arts', 'Science', 'Commerce',
      'Pharmacy', 'Architecture', 'Design', 'Agriculture', 'Education', 'Nursing',
      'Dental', 'Hotel Management', 'Mass Communication', 'Computer Applications',
      'Aviation', 'Animation', 'Fashion Design', 'Interior Design'
    ],
    
    // Courses
    course: [
      // Engineering
      'B.Tech', 'B.E', 'M.Tech', 'M.E', 'Diploma in Engineering',
      // Medical
      'MBBS', 'BDS', 'BAMS', 'BHMS', 'B.Pharm', 'D.Pharm', 'M.Pharm', 'Pharm.D',
      // Management
      'MBA', 'BBA', 'PGDM', 'BMS', 'BBM', 'Executive MBA',
      // Commerce
      'B.Com', 'M.Com', 'CA', 'CS', 'CMA', 'BBA LLB',
      // Science
      'B.Sc', 'M.Sc', 'B.Sc Nursing', 'B.Sc Agriculture',
      // Arts
      'BA', 'MA', 'BA LLB', 'BFA', 'MFA',
      // Computer
      'BCA', 'MCA', 'B.Sc IT', 'B.Sc Computer Science',
      // Law
      'LLB', 'LLM', 'BA LLB', 'BBA LLB', 'B.Com LLB',
      // Others
      'B.Arch', 'M.Arch', 'B.Des', 'M.Des', 'BJMC', 'MJMC', 'BHM', 'B.Ed', 'M.Ed'
    ],
    
    // Degree Type
    degreeType: [
      'Undergraduate (UG)', 'Postgraduate (PG)', 'Doctorate (PhD)', 
      'Diploma', 'Certificate', 'Integrated', 'Executive'
    ],
    
    // Exams Accepted
    examAccepted: [
      // Engineering
      'JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'SRMJEEE', 'MET', 'COMEDK',
      // Medical
      'NEET UG', 'NEET PG', 'AIIMS', 'JIPMER', 'PGIMER',
      // Management
      'CAT', 'MAT', 'XAT', 'CMAT', 'GMAT', 'NMAT', 'SNAP', 'ATMA',
      // Law
      'CLAT', 'AILET', 'LSAT', 'MH CET Law',
      // Design
      'NID DAT', 'NIFT', 'UCEED', 'CEED',
      // Others
      'CUET', 'GATE', 'UGC NET', 'GPAT', 'NATA', 'State CET'
    ],
    
    // Affiliation - Indian Affiliation Bodies
    affiliation: [
      // Central Bodies
      'UGC (University Grants Commission)',
      'AICTE (All India Council for Technical Education)',
      'MCI (Medical Council of India)',
      'NMC (National Medical Commission)',
      'BCI (Bar Council of India)',
      'PCI (Pharmacy Council of India)',
      'DCI (Dental Council of India)',
      'INC (Indian Nursing Council)',
      'NCTE (National Council for Teacher Education)',
      'COA (Council of Architecture)',
      'ICAR (Indian Council of Agricultural Research)',
      'VCI (Veterinary Council of India)',
      'CCH (Central Council of Homoeopathy)',
      'CCIM (Central Council of Indian Medicine)',
      // University Types
      'Central University',
      'State University',
      'Deemed University',
      'Private University',
      'Autonomous Institution',
      // Premier Institutes
      'IIT (Indian Institute of Technology)',
      'IIM (Indian Institute of Management)',
      'NIT (National Institute of Technology)',
      'IIIT (Indian Institute of Information Technology)',
      'AIIMS (All India Institute of Medical Sciences)',
      'IISER (Indian Institute of Science Education and Research)',
      'IISc (Indian Institute of Science)',
      'NIFT (National Institute of Fashion Technology)',
      'NID (National Institute of Design)',
      'NLSIU (National Law School)'
    ],
    
    // Recognition - Indian Recognition Bodies
    recognition: [
      // Government Recognition
      'UGC Recognized',
      'AICTE Approved',
      'Government of India Recognized',
      'State Government Recognized',
      'Ministry of Education Recognized',
      'MHRD Approved',
      // Rankings
      'NIRF Ranked',
      'NIRF Top 10',
      'NIRF Top 25',
      'NIRF Top 50',
      'NIRF Top 100',
      'NIRF Top 200',
      // International Rankings
      'QS World University Ranking',
      'Times Higher Education Ranking',
      'ARWU (Shanghai Ranking)',
      'US News Global Ranking',
      // Special Recognition
      'Institute of National Importance',
      'Institute of Eminence (IoE)',
      'Category I University',
      'Category II University',
      '12B Status',
      '2(f) Status',
      'EQUIS Accredited',
      'AACSB Accredited',
      'AMBA Accredited'
    ],
    
    // Accreditation - Indian Accreditation Bodies
    accreditation: [
      // NAAC Grades
      'NAAC A++ (Highest)',
      'NAAC A+',
      'NAAC A',
      'NAAC B++',
      'NAAC B+',
      'NAAC B',
      'NAAC C',
      // NBA Accreditation
      'NBA Accredited (Tier 1)',
      'NBA Accredited (Tier 2)',
      'NBA Accredited',
      // Other Accreditations
      'NABH (National Accreditation Board for Hospitals)',
      'NABL (National Accreditation Board for Laboratories)',
      'QCI (Quality Council of India)',
      // International Accreditations
      'ABET Accredited',
      'AACSB Accredited',
      'EQUIS Accredited',
      'AMBA Accredited',
      'ACBSP Accredited',
      'EFMD Accredited',
      // ISO Certifications
      'ISO 9001:2015',
      'ISO 14001:2015',
      'ISO 21001:2018 (Education)',
      // Medical Accreditations
      'WFME Recognized',
      'MCI/NMC Approved',
      // Other
      'Washington Accord Signatory',
      'IACBE Accredited'
    ],
    
    state: allStates,
    city: getAvailableCities(),
    
    // College Type
    collegeType: ['Government', 'Private', 'Deemed', 'Autonomous', 'Public-Private', 'Aided'],
    
    // Program Type
    programType: ['Full Time', 'Part Time', 'Distance Learning', 'Online', 'Weekend', 'Evening']
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
    // Reset state when filters/location changes
    setInstitutions([]);
    setAllInstitutionsData([]);
    setPagination(prev => ({ ...prev, page: 1 }));
    setHasMore(true);
    fetchInstitutions();
    fetchPageContent();
    fetchFeaturedColleges();
    fetchAdmissionOpenColleges();
  }, [location.pathname, filters.search, sortBy]);
  
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
      } catch (e2) {}
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
      } catch (e2) {}
    }
  };
  
  // Fetch page content from admin panel
  const fetchPageContent = async () => {
    try {
      // Build the URL slug to look up
      const pathParts = location.pathname.split('/').filter(Boolean);
      let slug = pathParts.join('/') || 'india-colleges';
      
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
      const buildQueryParams = (institutionType = null) => {
        let queryParams = new URLSearchParams();
        queryParams.append('limit', 100);
        queryParams.append('fields', 'minimal');  // Optimize payload size
        
        if (institutionType) {
          queryParams.append('institution_type', institutionType);
        }
        
        // Handle combined filters (state + city from URL)
        if (pageInfo.state) {
          queryParams.append('state', toDisplayName(pageInfo.state));
        }
        if (pageInfo.city) {
          queryParams.append('city', toDisplayName(pageInfo.city));
        }
        
        // Handle single location filter
        if (pageInfo.location && !pageInfo.state && !pageInfo.city) {
          const locationDisplay = toDisplayName(pageInfo.location);
          if (pageInfo.locationType === 'state') {
            queryParams.append('state', locationDisplay);
          } else if (pageInfo.locationType === 'city') {
            queryParams.append('city', locationDisplay);
          }
        }
        
        if (pageInfo.stream) {
          queryParams.append('stream', toDisplayName(pageInfo.stream));
        }
        
        if (pageInfo.subStream) {
          queryParams.append('sub_stream', toDisplayName(pageInfo.subStream));
        }
        
        if (filters.search) {
          queryParams.append('search', filters.search);
        }
        
        if (filters.type.length > 0) {
          queryParams.append('type', filters.type[0]);
        }
        
        return queryParams;
      };
      
      let allData = [];
      
      if (pageInfo.institutionTypes && pageInfo.institutionTypes.length > 0) {
        const fetchPromises = pageInfo.institutionTypes.map(async (type) => {
          const queryParams = buildQueryParams(type);
          const response = await api.get(`/colleges?${queryParams.toString()}`);
          return response.data || [];
        });
        
        const results = await Promise.all(fetchPromises);
        allData = results.flat();
      } else {
        const queryParams = buildQueryParams();
        const response = await api.get(`/colleges?${queryParams.toString()}`);
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
        allData.sort((a, b) => (a.nirf_ranking || 999) - (b.nirf_ranking || 999));
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
    const queryParams = new URLSearchParams();
    
    // Preserve existing query filters from URL
    const existingQueryFilters = urlInfo.queryFilters || {};
    
    // Add existing query filters
    if (existingQueryFilters.course) queryParams.set('course', existingQueryFilters.course);
    if (existingQueryFilters.degreeType) queryParams.set('degree', existingQueryFilters.degreeType);
    if (existingQueryFilters.examAccepted) queryParams.set('exam', existingQueryFilters.examAccepted);
    if (existingQueryFilters.affiliation) queryParams.set('affiliation', existingQueryFilters.affiliation);
    if (existingQueryFilters.recognition) queryParams.set('recognition', existingQueryFilters.recognition);
    
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

  // Handle filter selection - Navigate to SEO-friendly URLs with combined filters
  const handleFilterSelect = (filterType, value) => {
    setActiveFilterDropdown(null);
    
    const suffix = pageInfo.isSchools ? 'schools' : 'colleges';
    const currentStream = activeFilters.stream || activeFilters.subStream;
    const currentState = activeFilters.state;
    const currentCity = activeFilters.city;
    const currentCollegeType = activeFilters.collegeType;
    const currentAccreditation = activeFilters.accreditation;
    
    // Build combined URL based on selected filter and existing filters
    if (filterType === 'state') {
      const stateSlug = generateSlug(value);
      let basePath;
      // If stream is selected, combine: /engineering/maharashtra-colleges
      if (currentStream) {
        basePath = `/${generateSlug(currentStream)}/${stateSlug}-${suffix}`;
      } else if (currentCollegeType) {
        basePath = `/${TYPE_TO_SLUG[currentCollegeType] || generateSlug(currentCollegeType)}/${stateSlug}-${suffix}`;
      } else if (currentAccreditation) {
        basePath = `/${ACCREDITATION_TO_SLUG[currentAccreditation] || generateSlug(currentAccreditation)}/${stateSlug}-${suffix}`;
      } else {
        basePath = `/${stateSlug}-${suffix}`;
      }
      navigate(buildUrlWithQueryParams(basePath));
      return;
    }
    
    if (filterType === 'city') {
      const citySlug = generateSlug(value);
      let basePath;
      // If stream is selected, combine: /engineering/mumbai-colleges
      if (currentStream) {
        basePath = `/${generateSlug(currentStream)}/${citySlug}-${suffix}`;
      } 
      // If state is selected, combine: /maharashtra/mumbai-colleges
      else if (currentState) {
        basePath = `/${generateSlug(currentState)}/${citySlug}-${suffix}`;
      } else {
        basePath = `/${citySlug}-${suffix}`;
      }
      navigate(buildUrlWithQueryParams(basePath));
      return;
    }
    
    // Stream filter
    if (filterType === 'stream' || filterType === 'subStream') {
      const streamSlug = generateSlug(value);
      let basePath;
      // If state or city is selected, combine: /engineering/maharashtra-colleges
      if (currentState) {
        basePath = `/${streamSlug}/${generateSlug(currentState)}-${suffix}`;
      } else if (currentCity) {
        basePath = `/${streamSlug}/${generateSlug(currentCity)}-${suffix}`;
      } else {
        // Navigate to /india-colleges/engineering format
        basePath = `/india-${suffix}/${streamSlug}`;
      }
      navigate(buildUrlWithQueryParams(basePath));
      return;
    }
    
    // Type filter - SEO URL (e.g., /government-colleges)
    if (filterType === 'collegeType') {
      const typeSlug = TYPE_TO_SLUG[value] || generateSlug(value);
      let basePath;
      if (currentState) {
        basePath = `/${typeSlug}/${generateSlug(currentState)}-${suffix}`;
      } else if (currentCity) {
        basePath = `/${typeSlug}/${generateSlug(currentCity)}-${suffix}`;
      } else {
        basePath = `/${typeSlug}-${suffix}`;
      }
      navigate(buildUrlWithQueryParams(basePath));
      return;
    }
    
    // Accreditation filter - SEO URL (e.g., /naac-a-plus-colleges)
    if (filterType === 'accreditation') {
      const accredSlug = ACCREDITATION_TO_SLUG[value] || generateSlug(value);
      let basePath;
      if (currentState) {
        basePath = `/${accredSlug}/${generateSlug(currentState)}-${suffix}`;
      } else if (currentCity) {
        basePath = `/${accredSlug}/${generateSlug(currentCity)}-${suffix}`;
      } else {
        basePath = `/${accredSlug}-${suffix}`;
      }
      navigate(buildUrlWithQueryParams(basePath));
      return;
    }
    
    // Secondary filters - Query parameters (course, degreeType, examAccepted, affiliation, recognition)
    if (['course', 'degreeType', 'examAccepted', 'affiliation', 'recognition'].includes(filterType)) {
      const currentPath = location.pathname;
      navigate(buildUrlWithQueryParams(currentPath, { type: filterType, value }));
      return;
    }
    
    // For other filters - apply as local filter
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Toggle filter for Type - now navigates to URL
  const toggleFilter = (type) => {
    // If type is already selected (from URL), remove it by going back to base URL
    if (activeFilters.collegeType === type) {
      const suffix = pageInfo.isSchools ? 'schools' : 'colleges';
      navigate(`/india-${suffix}`);
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
    const suffix = pageInfo.isSchools ? 'schools' : 'colleges';
    navigate(`/india-${suffix}`);
  };

  const removeFilter = (filterType) => {
    setFilters(prev => ({ ...prev, [filterType]: '' }));
  };
  
  // Breadcrumb generation
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Home', path: '/' }];
    
    if (urlInfo.type === 'institution-listing') {
      const isSchools = urlInfo.institutionType === 'schools';
      const typeName = isSchools ? 'Schools' : 'Colleges';
      
      if (urlInfo.location) {
        crumbs.push({ label: `All ${typeName} in India`, path: `/india-${urlInfo.institutionType}` });
        crumbs.push({ label: `${toDisplayName(urlInfo.location)} ${typeName}`, path: location.pathname });
      } else {
        crumbs.push({ label: `All ${typeName} in India`, path: location.pathname });
      }
    } else if (urlInfo.type === 'stream-listing') {
      crumbs.push({ label: 'All Colleges in India', path: '/india-colleges' });
      if (pageInfo.stream) {
        crumbs.push({ label: `${toDisplayName(pageInfo.stream)} Colleges`, path: `/${pageInfo.stream}` });
      }
    }
    
    return crumbs;
  }, [urlInfo, pageInfo, location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{pageContent?.meta_title || pageInfo.title} | AdmissionBuddy</title>
        <meta name="description" content={pageContent?.meta_description || pageInfo.description} />
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
                {pageContent?.page_title || pageInfo.title}
              </h1>
              {pageContent?.page_subtitle && (
                <p className="text-blue-200 text-sm md:text-base max-w-2xl">{pageContent.page_subtitle}</p>
              )}
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  <strong>{totalCount.toLocaleString()}</strong> Colleges Found
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5">
                  <FiCheckCircle className="text-green-400" />
                  Verified Information
                </span>
              </div>
            </div>
            
            {/* Author Info - Compact */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                {pageContent?.updated_by_photo || pageContent?.created_by_photo ? (
                  <img 
                    src={pageContent?.updated_by_photo || pageContent?.created_by_photo} 
                    alt={pageContent?.updated_by_name || 'Author'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                    <FiUser size={18} />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-blue-200">Curated by</p>
                <p className="font-semibold text-sm">
                  {pageContent?.updated_by_name || pageContent?.created_by_name || 'Content Team'}
                </p>
                <p className="text-xs text-blue-300">
                  {pageContent?.updated_at ? `Updated ${formatTimeAgo(pageContent.updated_at)}` : 'Updated recently'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTION CARDS */}
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

      {/* CONTENT SECTIONS */}
      <div className="bg-white py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* INTRO CONTENT - Use admin content if available */}
          <section className="mb-4">
            <div className="text-gray-700 text-sm md:text-base leading-relaxed">
              {pageContent?.introduction ? (
                <div 
                  className={`prose max-w-none ${!showContent ? 'line-clamp-3' : ''}`}
                  dangerouslySetInnerHTML={{ __html: pageContent.introduction }}
                />
              ) : (
                <p className={`${!showContent ? 'line-clamp-3' : ''}`}>
                  India is home to over <strong>{totalCount.toLocaleString()} colleges</strong> offering diverse programs across engineering, medical, management, arts, and more. Whether you are looking for <strong>government colleges</strong> with affordable fees or <strong>private institutions</strong> with world-class facilities, we have comprehensive information to help you make the right choice. The fees of colleges vary from <strong>₹4,400 at AU Allahabad</strong> to <strong>₹37.8 Lakh at ICAS Manipal</strong>, while the Median Package ranges from ₹17 LPA at IIT Roorkee to ₹21.60 LPA at IIT Guwahati.
                </p>
              )}
            </div>
          </section>

          {/* Read More Button */}
          {!showContent && (
            <div className="text-center mb-4">
              <button
                onClick={() => setShowContent(true)}
                className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-sm font-medium rounded-full transition-all"
              >
                <span>Read More About Colleges in India</span>
                <FiChevronDown size={16} />
              </button>
            </div>
          )}

          {/* Collapsible Content */}
          {showContent && (
          <div className="space-y-8">
          
          {/* BULLET POINTS */}
          <section>
            <div className="text-gray-700 text-sm leading-relaxed">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Some of the top colleges in India are <strong>IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur and IIT Kharagpur</strong>.</li>
                <li><strong>IIT Bombay</strong> is the best college in India, as per the Collegedunia and IIRF rankings.</li>
                <li><strong>IIT BHU has the best ROI of 239.52%</strong>.</li>
              </ul>
            </div>
          </section>

          {/* TABLE OF CONTENTS */}
          <section>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { num: '01', title: 'Colleges in India Highlights', id: 'highlights' },
                  { num: '02', title: 'Top Colleges in India 2025', id: 'top-colleges' },
                  { num: '03', title: 'Govt Colleges in India 2025', id: 'govt-colleges' },
                  { num: '04', title: 'Private Colleges in India 2025', id: 'private-colleges' },
                  { num: '05', title: 'Colleges in India ROI Wise 2025', id: 'roi-colleges' },
                  { num: '06', title: 'Colleges with the Lowest Fees', id: 'lowest-fees' },
                  { num: '07', title: 'Entrance Exams', id: 'exams' },
                  { num: '08', title: 'FAQs', id: 'faqs' },
                ].map((item) => (
                  <a 
                    key={item.id}
                    href={`#${item.id}`} 
                    className="text-sm text-blue-600 hover:underline flex items-start gap-2"
                  >
                    <span className="font-semibold">{item.num}.</span>
                    <span>{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
          
          {/* HIGHLIGHTS TABLE */}
          <section id="highlights">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Colleges in India Highlights</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 border-b">Details</th>
                    <th className="px-4 py-2 text-left text-sm font-bold text-gray-700 border-b">Statistics</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Number of Colleges in India', value: '4,359' },
                    { label: 'Number of Govt Colleges in India', value: '676' },
                    { label: 'Number of Private Colleges in India', value: '3,623' },
                    { label: 'Top College', value: 'IIT Bombay' },
                    { label: 'Top Specialisations', value: 'Computer Science, Mechanical, IT, Civil, Electronics' },
                    { label: 'Total Fees Range', value: '₹4,400 - ₹37.8 Lakh' },
                    { label: 'Median Package', value: '₹14.35 LPA - ₹21.60 LPA' },
                    { label: 'Accepted Entrance Exam', value: 'JEE Main, NEET, CAT, GATE' },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm font-semibold text-gray-900 border-b">{row.label}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 border-b">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TOP COLLEGES TABLE */}
          <section id="top-colleges">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Top Colleges in India 2025</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">Colleges</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">Fees</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">Placement</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'IIT Bombay', fees: '₹8.75 Lakh', placement: '₹19.61 LPA' },
                    { name: 'IIT Delhi', fees: '₹8.66 Lakh', placement: '₹19.08 LPA' },
                    { name: 'IIT Madras', fees: '₹9.39 Lakh', placement: '₹17.50 LPA' },
                    { name: 'IIT Kanpur', fees: '₹8.6 Lakh', placement: '₹19.40 LPA' },
                    { name: 'IIT Kharagpur', fees: '₹10.29 Lakh', placement: '₹19.76 LPA' },
                  ].map((college, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm font-medium text-blue-600">{college.name}</td>
                      <td className="px-3 py-2 text-sm font-semibold text-gray-900">{college.fees}</td>
                      <td className="px-3 py-2 text-sm font-semibold text-green-600">{college.placement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Government Colleges */}
          <section id="govt-colleges">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Govt Colleges in India 2025</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">College Name</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">Location</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'IIT Bombay', location: 'Mumbai', fees: '₹8.75L' },
                    { name: 'IIT Delhi', location: 'Delhi', fees: '₹8.66L' },
                    { name: 'NIT Trichy', location: 'Trichy', fees: '₹5.6L' },
                  ].map((college, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm font-medium text-blue-600">{college.name}</td>
                      <td className="px-3 py-2 text-sm">{college.location}</td>
                      <td className="px-3 py-2 text-sm font-semibold">{college.fees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Private Colleges */}
          <section id="private-colleges">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Private Colleges in India 2025</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">College Name</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">Location</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700 border-b">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'BITS Pilani', location: 'Pilani', fees: '₹23.9L' },
                    { name: 'VIT Vellore', location: 'Vellore', fees: '₹7.83L' },
                    { name: 'Manipal Institute', location: 'Manipal', fees: '₹18.2L' },
                  ].map((college, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm font-medium text-blue-600">{college.name}</td>
                      <td className="px-3 py-2 text-sm">{college.location}</td>
                      <td className="px-3 py-2 text-sm font-semibold">{college.fees}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ROI Section */}
          <section id="roi-colleges">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Colleges in India ROI Wise 2025</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { rank: 1, name: 'IIT BHU', roi: '239.52%' },
                { rank: 2, name: 'NIT Trichy', roi: '256.25%' },
                { rank: 3, name: 'IIT Bombay', roi: '224.11%' },
              ].map((college) => (
                <div key={college.rank} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border">
                  <span className="text-xs text-gray-500">Rank #{college.rank}</span>
                  <h3 className="font-bold text-base text-gray-900">{college.name}</h3>
                  <p className="text-2xl font-bold text-green-600">{college.roi}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Lowest Fees */}
          <section id="lowest-fees">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Colleges with the Lowest Fees</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'AU Allahabad', fees: '₹4,400', type: 'Government' },
                { name: 'Jamia Millia', fees: '₹14,600', type: 'Government' },
                { name: 'BHU Varanasi', fees: '₹48,000', type: 'Government' },
              ].map((college, idx) => (
                <div key={idx} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-4 border">
                  <h3 className="font-bold text-base text-gray-900 mb-1">{college.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-1">{college.fees}</p>
                  <p className="text-xs text-gray-600">{college.type}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Entrance Exams */}
          <section id="exams">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Entrance Exams</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['JEE Main', 'NEET', 'CAT', 'GATE', 'CLAT', 'CMAT', 'XAT', 'MAT'].map((exam) => (
                <div key={exam} className="bg-green-50 rounded-lg p-3 border text-center">
                  <p className="font-bold text-sm text-gray-900">{exam}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Admin Content Sections */}
          {pageContent?.content_sections?.length > 0 && (
            <section id="content-sections">
              {pageContent.content_sections.map((section, idx) => (
                <div key={idx} className="mb-6 bg-white rounded-lg p-4 border" id={section.title?.toLowerCase().replace(/\s+/g, '-')}>
                  {section.title && <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>}
                  
                  {/* Text + Image Layout - Full Width */}
                  {section.type === 'text_image' && section.media_url ? (
                    <div>
                      <div className="text-sm text-gray-700 prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: section.content }} />
                      <div className="w-full">
                        <img 
                          src={section.media_url} 
                          alt={section.media_alt || section.title || 'Image'} 
                          className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                        />
                        {section.media_alt && <p className="text-xs text-gray-500 mt-2 text-center italic">{section.media_alt}</p>}
                      </div>
                    </div>
                  ) : section.type === 'text_video' && section.media_url ? (
                    /* Text + Video Layout - Full Width */
                    <div>
                      <div className="text-sm text-gray-700 prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: section.content }} />
                      <div className="w-full">
                        <iframe 
                          src={section.media_url} 
                          title={section.media_alt || section.title || 'Video'}
                          className="w-full h-64 md:h-96 rounded-lg shadow-md"
                          allowFullScreen
                        />
                        {section.media_alt && <p className="text-xs text-gray-500 mt-2 text-center italic">{section.media_alt}</p>}
                      </div>
                    </div>
                  ) : section.type === 'text_table' && section.table_data ? (
                    /* Text + Table Layout */
                    <div>
                      <div className="text-sm text-gray-700 prose max-w-none mb-3" dangerouslySetInnerHTML={{ __html: section.content }} />
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 text-sm">
                          <thead>
                            <tr className="bg-orange-50">
                              {section.table_data.headers?.map((header, hIdx) => (
                                <th key={hIdx} className="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-800">{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table_data.rows?.map((row, rIdx) => (
                              <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="border border-gray-200 px-3 py-2 text-gray-700">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    /* Text Only */
                    <div className="text-sm text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                  )}
                </div>
              ))}
            </section>
          )}

          {/* FAQs - Use admin content if available, otherwise show default */}
          <section id="faqs">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {pageContent?.page_title ? `${pageContent.page_title} FAQs` : 'Colleges in India FAQs'}
            </h2>
            <div className="space-y-3">
              {(pageContent?.faqs?.length > 0 ? pageContent.faqs : [
                { question: 'How many colleges are there in India?', answer: 'There are approximately 4,359 colleges in India, including 676 government and 3,623 private colleges.' },
                { question: 'What is the top college in India?', answer: 'IIT Bombay is ranked as the top college in India as per various rankings.' },
                { question: 'What is the fee range for colleges in India?', answer: 'The fee range varies from ₹10,000 per year in some government colleges to ₹40 Lakh in top private institutions.' },
              ]).map((faq, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border">
                  <h3 className="font-bold text-base text-gray-900 mb-1">{faq.question || faq.q}</h3>
                  <p className="text-sm text-gray-700">{faq.answer || faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Pages from Admin */}
          {pageContent?.related_pages?.length > 0 && (
            <section id="related-pages" className="mt-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Related Pages</h2>
              <div className="flex flex-wrap gap-2">
                {pageContent.related_pages.map((link, idx) => (
                  <Link 
                    key={idx} 
                    to={link.url} 
                    className="text-sm text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded-full"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Read Less Button */}
          <div className="text-center mt-4">
            <button
              onClick={() => setShowContent(false)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-medium rounded-full transition-colors"
            >
              <span>Read Less</span>
              <FiChevronUp size={14} />
            </button>
          </div>
          </div>
          )}
        </div>
      </div>

      {/* Ad Banner - Above Filters */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4 md:px-6">
          <AdBanner pageName="colleges" position="top" />
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
                Filter Colleges
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
              
              {/* Stream Filter */}
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
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border py-2 z-50 max-h-60 overflow-y-auto">
                    {activeFilters.state && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50">
                        Cities in {activeFilters.state}
                      </div>
                    )}
                    {filterOptions.city.length > 0 ? (
                      filterOptions.city.map((option) => (
                        <button 
                          key={option} 
                          onClick={() => handleFilterSelect('city', option)} 
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${
                            activeFilters.city === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {option} {activeFilters.city === option && '✓'}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No cities available</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* College Type Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'collegeType' ? null : 'collegeType')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    activeFilters.collegeType 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {activeFilters.collegeType || 'Type Of College'}
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
              
              {/* Course Filter */}
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
              
              {/* Degree Type Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'degreeType' ? null : 'degreeType')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    filters.degreeType 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {filters.degreeType || 'Degree Type'}
                  <FiChevronDown size={14} className={activeFilterDropdown === 'degreeType' ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                {activeFilterDropdown === 'degreeType' && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border py-2 z-50 max-h-60 overflow-y-auto">
                    {filterOptions.degreeType.map((option) => (
                      <button key={option} onClick={() => handleFilterSelect('degreeType', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${filters.degreeType === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {filters.degreeType === option && '✓'}</button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Exam Accepted Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'examAccepted' ? null : 'examAccepted')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    filters.examAccepted 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {filters.examAccepted || 'Exam Accepted'}
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
                        <button key={option} onClick={() => handleFilterSelect('examAccepted', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${filters.examAccepted === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {filters.examAccepted === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Affiliation Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'affiliation' ? null : 'affiliation')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    filters.affiliation 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {filters.affiliation ? filters.affiliation.split(' ')[0] : 'Affiliation'}
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
                        <button key={option} onClick={() => handleFilterSelect('affiliation', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${filters.affiliation === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {filters.affiliation === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Recognition Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'recognition' ? null : 'recognition')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                    filters.recognition 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {filters.recognition ? filters.recognition.split(' ')[0] : 'Recognition'}
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
                        <button key={option} onClick={() => handleFilterSelect('recognition', option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 ${filters.recognition === option ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {filters.recognition === option && '✓'}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Accreditation Filter - SEO URL */}
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
            </div>
            
            {/* Applied Filters Row - Only show if filters are active */}
            {(activeFilters.stream || activeFilters.state || activeFilters.city || activeFilters.collegeType || activeFilters.accreditation || filters.course || filters.degreeType || filters.examAccepted || filters.affiliation || filters.recognition) && (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 font-medium">Applied Filters:</span>
                  
                  {/* Show active URL-based filters */}
                  {activeFilters.stream && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                      {activeFilters.stream}
                      <button onClick={() => window.location.href = pageInfo.isSchools ? '/india-schools' : '/india-colleges'} className="hover:bg-blue-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {activeFilters.state && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                      {activeFilters.state}
                      <button onClick={() => window.location.href = pageInfo.isSchools ? '/india-schools' : '/india-colleges'} className="hover:bg-green-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {activeFilters.city && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                      {activeFilters.city}
                      <button onClick={() => window.location.href = pageInfo.isSchools ? '/india-schools' : '/india-colleges'} className="hover:bg-purple-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Show Type from URL */}
                  {activeFilters.collegeType && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs font-medium">
                      {activeFilters.collegeType}
                      <button onClick={() => window.location.href = pageInfo.isSchools ? '/india-schools' : '/india-colleges'} className="hover:bg-orange-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Show Accreditation from URL */}
                  {activeFilters.accreditation && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">
                      {activeFilters.accreditation}
                      <button onClick={() => window.location.href = pageInfo.isSchools ? '/india-schools' : '/india-colleges'} className="hover:bg-teal-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Course filter */}
                  {filters.course && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium">
                      {filters.course}
                      <button onClick={() => setFilters(prev => ({ ...prev, course: '' }))} className="hover:bg-indigo-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Degree Type filter */}
                  {filters.degreeType && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-xs font-medium">
                      {filters.degreeType}
                      <button onClick={() => setFilters(prev => ({ ...prev, degreeType: '' }))} className="hover:bg-pink-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Exam Accepted filter */}
                  {filters.examAccepted && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
                      {filters.examAccepted}
                      <button onClick={() => setFilters(prev => ({ ...prev, examAccepted: '' }))} className="hover:bg-yellow-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Affiliation filter */}
                  {filters.affiliation && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium">
                      {filters.affiliation.split(' ')[0]}
                      <button onClick={() => setFilters(prev => ({ ...prev, affiliation: '' }))} className="hover:bg-cyan-200 rounded-full p-0.5"><FiX size={12} /></button>
                    </span>
                  )}
                  
                  {/* Recognition filter */}
                  {filters.recognition && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-medium">
                      {filters.recognition.split(' ')[0]}
                      <button onClick={() => setFilters(prev => ({ ...prev, recognition: '' }))} className="hover:bg-rose-200 rounded-full p-0.5"><FiX size={12} /></button>
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
                <p className="text-gray-900 text-xl font-bold mb-2">No colleges found</p>
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
                          <span className="text-white font-bold text-sm">Featured Colleges</span>
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
                                      <img src={featured.logo_url} alt={featured.name} className="w-full h-full object-contain p-1" />
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
                                      {featured.rating > 0 && (
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-0.5">
                                          <FiStar size={10} className="fill-current" /> {featured.rating.toFixed(1)}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-xs text-orange-600 font-medium mt-2 inline-block">Apply Now →</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="text-center mt-4">
                            <Link to="/featured-colleges" className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1">
                              View All Featured Colleges <FiArrowRight size={14} />
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
                          <span className="text-white font-bold text-sm">Admissions Open 2025</span>
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
                                      <img src={college.logo_url} alt={college.name} className="w-full h-full object-contain p-1" />
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
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all group">
                    {/* Top Badge Bar */}
                    {(inst.is_featured || inst.is_admission_open || inst.nirf_ranking || inst.is_admission_partner || inst.is_no_cost_emi) && (
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 flex items-center gap-2 flex-wrap border-b border-gray-100">
                        {inst.nirf_ranking && (
                          <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            #Rank {inst.nirf_ranking} in India
                          </span>
                        )}
                        {inst.is_featured && (
                          <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <FiStar size={10} className="fill-current" /> Featured
                          </span>
                        )}
                        {inst.is_admission_partner && (
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
                            🤝 Admission Partner
                          </span>
                        )}
                        {inst.is_no_cost_emi && (
                          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            💳 No Cost EMI
                          </span>
                        )}
                        {inst.is_admission_open && (
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                            Admissions Open
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="p-4 md:p-5">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Logo & Basic Info */}
                        <div className="flex gap-4 flex-1">
                          {/* Logo */}
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200 group-hover:border-blue-300 transition-colors">
                            {inst.logo_url ? (
                              <img src={inst.logo_url} alt={`${inst.name} logo | AdmissionBuddy`} className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">{inst.name?.charAt(0)}</span>
                            )}
                          </div>
                          
                          {/* College Info */}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                              className="font-bold text-base md:text-lg text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors"
                            >
                              {inst.name}
                            </Link>
                            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mt-1.5 flex-wrap">
                              <span className="flex items-center gap-1">
                                <FiMapPin size={12} className="text-gray-400" />
                                {inst.location?.city}{inst.location?.state ? `, ${inst.location.state}` : ''}
                              </span>
                              {inst.type && (
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  inst.type === 'Government' ? 'bg-blue-100 text-blue-700' : 
                                  inst.type === 'Private' ? 'bg-purple-100 text-purple-700' : 
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {inst.type}
                                </span>
                              )}
                              {inst.is_verified && (
                                <span className="flex items-center gap-0.5 text-blue-600 text-xs">
                                  <FiCheckCircle size={12} /> Verified
                                </span>
                              )}
                            </div>
                            
                            {/* Stats Row - Desktop */}
                            <div className="hidden md:flex items-center gap-6 mt-3 text-sm">
                              {inst.average_fees > 0 && (
                                <div>
                                  <span className="text-gray-500">Fees:</span>
                                  <span className="ml-1 font-bold text-gray-900">
                                    ₹{inst.average_fees >= 100000 ? `${(inst.average_fees / 100000).toFixed(1)}L` : `${(inst.average_fees / 1000).toFixed(0)}K`}/yr
                                  </span>
                                </div>
                              )}
                              {inst.rating > 0 && (
                                <div className="flex items-center gap-1">
                                  <span className="text-gray-500">Rating:</span>
                                  <span className="font-bold text-gray-900">{inst.rating.toFixed(1)}</span>
                                  <FiStar size={12} className="text-yellow-500 fill-current" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Rating & Actions - Desktop */}
                        <div className="hidden md:flex flex-col items-end justify-between gap-2 min-w-[140px]">
                          {inst.rating > 0 && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200">
                              <FiStar size={16} className="fill-current text-green-500" />
                              <span className="font-bold text-lg">{inst.rating.toFixed(1)}</span>
                              <span className="text-xs text-green-600">/5</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleCompare(inst.id)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                compareList.includes(inst.id) 
                                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-transparent'
                              }`}
                            >
                              <FiBookmark size={14} className={compareList.includes(inst.id) ? 'fill-current' : ''} />
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); setSelectedCollege(inst); setApplyModalOpen(true); }}
                              className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs font-medium hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-1 shadow-sm"
                            >
                              <FiSend size={12} /> Apply
                            </button>
                            <Link 
                              to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-xs font-medium hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-1 shadow-sm"
                            >
                              View <FiArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Stats & CTA */}
                      <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 text-xs">
                            {inst.average_fees > 0 && (
                              <span className="text-gray-700">
                                <span className="text-gray-500">Fees: </span>
                                <strong>₹{inst.average_fees >= 100000 ? `${(inst.average_fees / 100000).toFixed(1)}L` : `${(inst.average_fees / 1000).toFixed(0)}K`}</strong>
                              </span>
                            )}
                            {inst.rating > 0 && (
                              <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                                <FiStar size={10} className="fill-current" /> {inst.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); setSelectedCollege(inst); setApplyModalOpen(true); }}
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg text-xs font-medium"
                          >
                            Apply
                          </button>
                          <Link 
                            to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium"
                          >
                            View →
                          </Link>
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
