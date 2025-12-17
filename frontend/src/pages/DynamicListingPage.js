import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiFilter, FiSearch, FiChevronDown, FiChevronUp, FiStar, FiBookmark, FiArrowRight, FiX, FiEdit3, FiGrid, FiTarget, FiUser, FiCheckCircle, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { parseListingUrl, isState, isCity, INDIAN_STATES, INDIAN_CITIES, getInstitutionDetailUrl, getInstitutionListingUrl } from '../utils/urlHelpers';
import { generateSlug } from '../utils/slugify';
import { Button } from '../components/ui/button';
import AdBanner from '../components/AdBanner';

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

const DynamicListingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [sortBy, setSortBy] = useState('ranking');
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);
  
  const [filters, setFilters] = useState({
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
  
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  
  // Parse URL to determine what to show
  const urlInfo = useMemo(() => parseListingUrl(location.pathname), [location.pathname]);
  
  // Determine page title and type from URL
  const pageInfo = useMemo(() => {
    // Handle combined filters from URL (e.g., /engineering/maharashtra-colleges or /maharashtra/mumbai-colleges)
    if (urlInfo.combinedFilters) {
      const cf = urlInfo.combinedFilters;
      const isSchools = urlInfo.institutionType === 'schools';
      const typeName = isSchools ? 'Schools' : 'Colleges';
      
      // Build title based on combined filters
      let titleParts = [];
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
        isSchools
      };
    }
    
    if (urlInfo.type === 'institution-listing') {
      const locationName = urlInfo.location 
        ? toDisplayName(urlInfo.location)
        : 'India';
      
      const isSchools = urlInfo.institutionType === 'schools';
      const typeName = isSchools ? 'Schools' : 'Colleges';
      
      return {
        title: `Top ${typeName} in ${locationName} 2025`,
        description: `Explore top ${typeName.toLowerCase()} in ${locationName}. Find courses, fees, placements, rankings and more.`,
        institutionTypes: isSchools ? ['School'] : ['College', 'University'],
        location: urlInfo.location,
        locationType: urlInfo.location ? (isState(urlInfo.location) ? 'state' : 'city') : null,
        isSchools
      };
    }
    
    if (urlInfo.type === 'institution-location-listing') {
      const locationName = toDisplayName(urlInfo.location);
      const isSchools = urlInfo.institutionType === 'school';
      const typeName = isSchools ? 'Schools' : 'Colleges';
      return {
        title: `Top ${typeName} in ${locationName} 2025`,
        description: `Explore top ${typeName.toLowerCase()} in ${locationName}. Find admissions, fees, and more.`,
        institutionTypes: isSchools ? ['School'] : ['College', 'University'],
        location: urlInfo.location,
        locationType: isState(urlInfo.location) ? 'state' : 'city',
        isSchools
      };
    }
    
    if (urlInfo.type === 'stream-listing') {
      const streamName = toDisplayName(urlInfo.stream);
      const subStreamName = urlInfo.subStream ? toDisplayName(urlInfo.subStream) : null;
      const locationName = urlInfo.location ? toDisplayName(urlInfo.location) : null;
      
      let title = `Top ${streamName} Colleges`;
      if (subStreamName && !isState(urlInfo.subStream) && !isCity(urlInfo.subStream)) {
        title = `Top ${streamName} - ${subStreamName} Colleges`;
      } else if (subStreamName) {
        title = `Top ${streamName} Colleges in ${subStreamName}`;
      }
      if (locationName) title = `Top ${streamName}${subStreamName && !isState(urlInfo.subStream) && !isCity(urlInfo.subStream) ? ` - ${subStreamName}` : ''} Colleges in ${locationName}`;
      
      let actualSubStream = urlInfo.subStream;
      let actualLocation = urlInfo.location;
      
      if (urlInfo.subStream && (isState(urlInfo.subStream) || isCity(urlInfo.subStream))) {
        actualLocation = urlInfo.subStream;
        actualSubStream = null;
      }
      
      return {
        title: `${title} 2025`,
        description: `Explore top colleges for ${streamName}${actualSubStream ? ` - ${toDisplayName(actualSubStream)}` : ''}${actualLocation ? ` in ${toDisplayName(actualLocation)}` : ''}.`,
        stream: urlInfo.stream,
        subStream: actualSubStream,
        location: actualLocation,
        locationType: actualLocation ? (isState(actualLocation) ? 'state' : 'city') : null,
        isSchools: false
      };
    }
    
    return {
      title: 'Top Colleges in India 2025',
      description: 'Explore top institutions in India',
      isSchools: false
    };
  }, [urlInfo]);
  
  // Active filters based on URL
  const activeFilters = useMemo(() => {
    const active = {
      stream: null,
      subStream: null,
      state: null,
      city: null,
    };
    
    // Check for combined filters from URL (e.g., /engineering/maharashtra-colleges)
    if (urlInfo.combinedFilters) {
      if (urlInfo.combinedFilters.stream) {
        active.stream = toDisplayName(urlInfo.combinedFilters.stream);
      }
      if (urlInfo.combinedFilters.state) {
        active.state = toDisplayName(urlInfo.combinedFilters.state);
      }
      if (urlInfo.combinedFilters.city) {
        active.city = toDisplayName(urlInfo.combinedFilters.city);
      }
      if (urlInfo.combinedFilters.location) {
        const loc = urlInfo.combinedFilters.location;
        if (isState(loc)) {
          active.state = toDisplayName(loc);
        } else if (isCity(loc)) {
          active.city = toDisplayName(loc);
        }
      }
    }
    
    // Check for stream from URL (e.g., /engineering, /medical)
    if (pageInfo.stream && !active.stream) {
      active.stream = toDisplayName(pageInfo.stream);
    }
    
    // Check for subStream
    if (pageInfo.subStream && !active.subStream) {
      active.subStream = toDisplayName(pageInfo.subStream);
    }
    
    // Check for location (state or city)
    if (pageInfo.location && !active.state && !active.city) {
      const locationName = toDisplayName(pageInfo.location);
      if (pageInfo.locationType === 'state') {
        active.state = locationName;
      } else if (pageInfo.locationType === 'city') {
        active.city = locationName;
      }
    }
    
    return active;
  }, [pageInfo, urlInfo]);
  
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
    subStream: ['Engineering', 'Medical', 'Management', 'Law', 'Arts', 'Science', 'Commerce'],
    stream: ['Engineering & Technology', 'Medical & Health Sciences', 'Management & Business', 'Law & Legal Studies', 'Arts & Humanities', 'Science'],
    state: allStates,
    city: getAvailableCities(),
    degree: ['B.Tech', 'MBA', 'MBBS', 'B.Com', 'B.Sc', 'BA', 'BBA', 'BCA', 'M.Tech', 'M.Com'],
    specialization: ['Computer Science', 'Mechanical', 'Civil', 'Electronics', 'Finance', 'Marketing', 'HR', 'Operations'],
    programType: ['Full Time', 'Part Time', 'Distance Learning', 'Online'],
    collegeType: ['Government', 'Private', 'Deemed', 'Autonomous']
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
    fetchInstitutions();
  }, [location.pathname, pagination.page, filters.search, sortBy]);
  
  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const buildQueryParams = (institutionType = null) => {
        let queryParams = new URLSearchParams();
        queryParams.append('limit', 100);
        
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
      
      const start = (pagination.page - 1) * pagination.limit;
      const paginatedData = allData.slice(start, start + pagination.limit);
      
      setInstitutions(paginatedData);
      setTotalCount(allData.length);
      setPagination(prev => ({ ...prev, total: allData.length }));
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter selection - Navigate to SEO-friendly URLs with combined filters
  const handleFilterSelect = (filterType, value) => {
    setActiveFilterDropdown(null);
    
    const suffix = pageInfo.isSchools ? 'schools' : 'colleges';
    const currentStream = activeFilters.stream || activeFilters.subStream;
    const currentState = activeFilters.state;
    const currentCity = activeFilters.city;
    
    // Build combined URL based on selected filter and existing filters
    if (filterType === 'state') {
      const stateSlug = generateSlug(value);
      // If stream is selected, combine: /engineering/maharashtra-colleges
      if (currentStream) {
        navigate(`/${generateSlug(currentStream)}/${stateSlug}-${suffix}`);
      } else {
        navigate(`/${stateSlug}-${suffix}`);
      }
      return;
    }
    
    if (filterType === 'city') {
      const citySlug = generateSlug(value);
      // If stream is selected, combine: /engineering/mumbai-colleges
      if (currentStream) {
        navigate(`/${generateSlug(currentStream)}/${citySlug}-${suffix}`);
      } 
      // If state is selected, combine: /maharashtra/mumbai-colleges
      else if (currentState) {
        navigate(`/${generateSlug(currentState)}/${citySlug}-${suffix}`);
      } else {
        navigate(`/${citySlug}-${suffix}`);
      }
      return;
    }
    
    // Stream filter
    if (filterType === 'stream' || filterType === 'subStream') {
      const streamSlug = generateSlug(value);
      // If state or city is selected, combine: /engineering/maharashtra-colleges
      if (currentState) {
        navigate(`/${streamSlug}/${generateSlug(currentState)}-${suffix}`);
      } else if (currentCity) {
        navigate(`/${streamSlug}/${generateSlug(currentCity)}-${suffix}`);
      } else {
        navigate(`/${streamSlug}`);
      }
      return;
    }
    
    // For other filters (type, degree, etc.) - apply as local filter
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const toggleFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
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
  };

  const removeFilter = (filterType) => {
    setFilters(prev => ({ ...prev, [filterType]: '' }));
  };

  const totalPages = Math.ceil(totalCount / pagination.limit);
  
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
    <div className="min-h-screen bg-gray-50 pt-2">
      <Helmet>
        <title>{pageInfo.title} | AdmissionBuddy</title>
        <meta name="description" content={pageInfo.description} />
        <link rel="canonical" href={`https://admissionbuddy.co${location.pathname}`} />
      </Helmet>
      
      {/* Top Ad Banner */}
      <AdBanner pageName="colleges" position="top" />
      
      {/* BREADCRUMB NAVIGATION */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 flex-wrap">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-orange-600 transition-colors">{crumb.label}</Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* PAGE HEADING */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-1.5">
          <h1 className="text-xl font-bold text-gray-900">{pageInfo.title}</h1>
        </div>
      </div>

      {/* ADVERTISEMENT BANNERS */}
      <div className="bg-white border-b py-2">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Link to="/write-review" className="block">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3 text-white hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center text-center">
                <FiEdit3 className="text-2xl mb-1" />
                <h3 className="font-bold text-sm mb-0.5">Write a Review</h3>
                <p className="text-[10px]">Get Upto ₹300*</p>
              </div>
            </Link>
            <Link to="/course-finder" className="block">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 text-white hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center text-center">
                <FiGrid className="text-2xl mb-1" />
                <h3 className="font-bold text-sm mb-0.5">Course Finder</h3>
                <p className="text-[10px]">Find Your Perfect Course</p>
              </div>
            </Link>
            <Link to="/college-predictor" className="block">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-3 text-white hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center text-center">
                <FiTarget className="text-2xl mb-1" />
                <h3 className="font-bold text-sm mb-0.5">College Predictor</h3>
                <p className="text-[10px]">Know Your Admission Chances</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* AUTHOR INFO */}
      <div className="bg-white py-1 border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                <FiUser size={12} />
              </div>
            </div>
            <div>
              <Link to="/author/content-team" className="text-[10px] font-semibold text-gray-900 hover:text-orange-600">Content Team</Link>
              <p className="text-[8px] text-gray-600">Content Curator | Updated 3+ months ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="bg-white py-2">
        <div className="container mx-auto px-6">
          
          {/* INTRO CONTENT */}
          <section className="mb-2">
            <div className="text-gray-700 text-sm leading-relaxed">
              <p className={`${!showContent ? 'line-clamp-3' : ''}`}>
                India has over <strong>4359 colleges</strong>, including <strong>3623 private colleges</strong> and <strong>676 government colleges</strong>. 
                Admissions in India are done mainly through <strong>JEE Main</strong>. Direct admission in colleges in India depends on merit based on 12th-class marks. 
                The fees of the colleges vary from <strong>₹4,400 at AU Allahabad</strong> to <strong>₹37.8 Lakh at ICAS Manipal</strong>, 
                while the Median Package ranges from ₹17 LPA at IIT Roorkee to ₹21.60 LPA at IIT Guwahati.
              </p>
            </div>
          </section>

          {/* Read More Button */}
          {!showContent && (
            <div className="text-center mb-2">
              <button
                onClick={() => setShowContent(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-medium rounded-full transition-colors"
              >
                <span>Read More</span>
                <FiChevronDown size={14} />
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

          {/* FAQs */}
          <section id="faqs">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Colleges in India FAQs</h2>
            <div className="space-y-3">
              {[
                { q: 'How many colleges are there in India?', a: 'There are approximately 4,359 colleges in India, including 676 government and 3,623 private colleges.' },
                { q: 'What is the top college in India?', a: 'IIT Bombay is ranked as the top college in India as per various rankings.' },
                { q: 'What is the fee range for colleges in India?', a: 'The fee range varies from ₹10,000 per year in some government colleges to ₹40 Lakh in top private institutions.' },
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3 border">
                  <h3 className="font-bold text-base text-gray-900 mb-1">{faq.q}</h3>
                  <p className="text-sm text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

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

      {/* COLLEGE LISTING SECTION */}
      <div className="bg-gray-50 py-4 border-t-4 border-orange-600">
        <div className="container mx-auto px-6">
          {/* HORIZONTAL FILTER BAR */}
          <div className="bg-white rounded-lg shadow-sm p-2.5 mb-4 relative">
            {/* Primary Filters Row */}
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <button 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiFilter size={12} />
                All Filter
              </button>
              
              {/* Stream Filter */}
              <div className="relative">
                <button 
                  onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'subStream' ? null : 'subStream')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeFilters.stream || activeFilters.subStream ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {activeFilters.stream || activeFilters.subStream || 'Stream'}
                  <FiChevronDown size={12} />
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeFilters.state ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {activeFilters.state || 'State'}
                  <FiChevronDown size={12} />
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    activeFilters.city ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {activeFilters.city || 'City'}
                  <FiChevronDown size={12} />
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    filters.type.length > 0 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filters.type.length > 0 ? filters.type.join(', ') : 'Type Of College'}
                  <FiChevronDown size={12} />
                </button>
                {activeFilterDropdown === 'collegeType' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border py-2 z-50 max-h-60 overflow-y-auto">
                    {filterOptions.collegeType.map((option) => (
                      <button key={option} onClick={() => toggleFilter(option)} className={`block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 ${filters.type.includes(option) ? 'text-orange-600 font-medium' : 'text-gray-700'}`}>{option} {filters.type.includes(option) && '✓'}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Dotted Separator */}
            <div className="border-t border-dashed border-gray-300 my-2"></div>
            
            {/* Applied Filters Row */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Show active URL-based filters */}
              {activeFilters.stream && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                  Stream: {activeFilters.stream}
                  <button onClick={() => navigate(pageInfo.isSchools ? '/india-schools' : '/india-colleges')} className="hover:bg-orange-600 rounded-full"><FiX size={12} /></button>
                </span>
              )}
              
              {activeFilters.state && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                  State: {activeFilters.state}
                  <button onClick={() => navigate(pageInfo.isSchools ? '/india-schools' : '/india-colleges')} className="hover:bg-orange-600 rounded-full"><FiX size={12} /></button>
                </span>
              )}
              
              {activeFilters.city && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                  City: {activeFilters.city}
                  <button onClick={() => navigate(pageInfo.isSchools ? '/india-schools' : '/india-colleges')} className="hover:bg-orange-600 rounded-full"><FiX size={12} /></button>
                </span>
              )}
              
              {/* Show local type filters */}
              {filters.type.map(type => (
                <span key={type} className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                  Type: {type}
                  <button onClick={() => toggleFilter(type)} className="hover:bg-orange-600 rounded-full"><FiX size={12} /></button>
                </span>
              ))}
              
              {/* Clear All button */}
              {(activeFilters.stream || activeFilters.state || activeFilters.city || filters.type.length > 0) && (
                <button 
                  onClick={() => {
                    clearFilters();
                    navigate(pageInfo.isSchools ? '/india-schools' : '/india-colleges');
                  }} 
                  className="text-xs text-gray-600 hover:text-gray-900 font-medium ml-1"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {/* MAIN LISTING */}
          <main>
            {/* Top Controls Bar */}
            <div className="mb-4 flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {loading ? 'Loading...' : `${totalCount} ${pageInfo.isSchools ? 'Schools' : 'Colleges'} Found`}
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm bg-white"
              >
                <option value="ranking">Sort by: Ranking</option>
                <option value="fees-low">Fees: Low to High</option>
                <option value="fees-high">Fees: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            {/* Compare Bar */}
            {compareList.length > 0 && (
              <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{compareList.length} colleges selected</span>
                    <Button size="sm" onClick={() => window.open(`/compare?ids=${compareList.join(',')}`, '_blank')} className="bg-orange-600 hover:bg-orange-700 text-white">Compare Now</Button>
                  </div>
                  <button onClick={() => setCompareList([])} className="text-sm text-gray-600 hover:text-gray-900">Clear All</button>
                </div>
              </div>
            )}

            {/* COLLEGE LIST */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading colleges...</p>
              </div>
            ) : institutions.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiSearch className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 text-lg mb-2">No colleges found</p>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
                <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {institutions.map((inst, idx) => (
                  <div key={inst.id || idx} className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      {/* Logo */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {inst.logo_url ? (
                          <img src={inst.logo_url} alt={inst.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-2xl font-bold text-gray-400">{inst.name?.charAt(0)}</span>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link 
                              to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                              className="font-semibold text-lg text-gray-900 hover:text-orange-600 line-clamp-1 transition-colors"
                            >
                              {inst.name}
                            </Link>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <FiMapPin size={14} />
                                {inst.location?.city}{inst.location?.state ? `, ${inst.location.state}` : ''}
                              </span>
                              {inst.type && <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{inst.type}</span>}
                              {inst.institution_type && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{inst.institution_type}</span>}
                            </div>
                          </div>
                          
                          {inst.rating > 0 && (
                            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                              <FiStar size={14} className="fill-current" />
                              <span className="font-semibold">{inst.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-4 mt-3 text-sm">
                          {inst.nirf_ranking && <span className="text-gray-600"><strong>NIRF:</strong> #{inst.nirf_ranking}</span>}
                          {inst.average_fees > 0 && <span className="text-gray-600"><strong>Fees:</strong> ₹{inst.average_fees >= 100000 ? `${(inst.average_fees / 100000).toFixed(1)}L` : `${(inst.average_fees / 1000).toFixed(0)}K`}/yr</span>}
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {inst.is_verified && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">✓ Verified</span>}
                          {inst.is_featured && <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">★ Featured</span>}
                          {inst.is_admission_open && <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Admissions Open</span>}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <button 
                          onClick={() => toggleCompare(inst.id)}
                          className={`p-2 rounded ${compareList.includes(inst.id) ? 'text-orange-600' : 'text-gray-400 hover:text-orange-600'}`}
                        >
                          <FiBookmark size={20} />
                        </button>
                        <Link 
                          to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name, inst.location?.city, inst.serial_number)}
                          className="text-orange-600 flex items-center gap-1 text-sm font-medium hover:underline"
                        >
                          View Details <FiArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && institutions.length > 0 && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-medium">
                  Page {pagination.page} of {totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DynamicListingPage;
