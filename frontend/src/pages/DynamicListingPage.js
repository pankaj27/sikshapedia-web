import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiFilter, FiSearch, FiChevronDown, FiStar, FiBookmark, FiArrowRight, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { parseListingUrl, isState, isCity, INDIAN_STATES, INDIAN_CITIES, getInstitutionDetailUrl, getInstitutionListingUrl } from '../utils/urlHelpers';
import { generateSlug } from '../utils/slugify';

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
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minFees: '',
    maxFees: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  
  // Parse URL to determine what to show
  const urlInfo = useMemo(() => parseListingUrl(location.pathname), [location.pathname]);
  
  // Determine page title and type from URL
  const pageInfo = useMemo(() => {
    if (urlInfo.type === 'institution-listing') {
      const locationName = urlInfo.location 
        ? toDisplayName(urlInfo.location)
        : 'India';
      const typeName = urlInfo.institutionType === 'colleges' ? 'Colleges' 
        : urlInfo.institutionType === 'schools' ? 'Schools' : 'Universities';
      return {
        title: `Top ${typeName} in ${locationName}`,
        description: `Explore top ${typeName.toLowerCase()} in ${locationName}. Find courses, fees, placements, rankings and more.`,
        institutionType: urlInfo.institutionType === 'colleges' ? 'College' 
          : urlInfo.institutionType === 'schools' ? 'School' : 'University',
        location: urlInfo.location,
        locationType: urlInfo.location ? (isState(urlInfo.location) ? 'state' : 'city') : null
      };
    }
    
    if (urlInfo.type === 'institution-location-listing') {
      const locationName = toDisplayName(urlInfo.location);
      const typeName = urlInfo.institutionType.charAt(0).toUpperCase() + urlInfo.institutionType.slice(1) + 's';
      return {
        title: `Top ${typeName} in ${locationName}`,
        description: `Explore top ${typeName.toLowerCase()} in ${locationName}. Find admissions, fees, and more.`,
        institutionType: urlInfo.institutionType.charAt(0).toUpperCase() + urlInfo.institutionType.slice(1),
        location: urlInfo.location,
        locationType: isState(urlInfo.location) ? 'state' : 'city'
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
        // subStream is actually a location
        title = `Top ${streamName} Colleges in ${subStreamName}`;
      }
      if (locationName) title = `Top ${streamName}${subStreamName && !isState(urlInfo.subStream) && !isCity(urlInfo.subStream) ? ` - ${subStreamName}` : ''} Colleges in ${locationName}`;
      
      // Determine if second param is location or sub-stream
      let actualSubStream = urlInfo.subStream;
      let actualLocation = urlInfo.location;
      
      if (urlInfo.subStream && (isState(urlInfo.subStream) || isCity(urlInfo.subStream))) {
        actualLocation = urlInfo.subStream;
        actualSubStream = null;
      }
      
      return {
        title,
        description: `Explore top colleges for ${streamName}${actualSubStream ? ` - ${toDisplayName(actualSubStream)}` : ''}${actualLocation ? ` in ${toDisplayName(actualLocation)}` : ''}.`,
        stream: urlInfo.stream,
        subStream: actualSubStream,
        location: actualLocation,
        locationType: actualLocation ? (isState(actualLocation) ? 'state' : 'city') : null
      };
    }
    
    return {
      title: 'Institutions',
      description: 'Explore top institutions in India'
    };
  }, [urlInfo]);
  
  useEffect(() => {
    fetchInstitutions();
  }, [location.pathname, pagination.page, filters.search]);
  
  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      queryParams.append('limit', pagination.limit);
      queryParams.append('skip', (pagination.page - 1) * pagination.limit);
      
      // Add institution type filter
      if (pageInfo.institutionType) {
        queryParams.append('institution_type', pageInfo.institutionType);
      }
      
      // Add location filter (state or city)
      if (pageInfo.location) {
        const locationDisplay = toDisplayName(pageInfo.location);
        if (pageInfo.locationType === 'state') {
          queryParams.append('state', locationDisplay);
        } else if (pageInfo.locationType === 'city') {
          queryParams.append('city', locationDisplay);
        }
      }
      
      // Add stream filter
      if (pageInfo.stream) {
        queryParams.append('stream', toDisplayName(pageInfo.stream));
      }
      
      // Add sub-stream filter
      if (pageInfo.subStream) {
        queryParams.append('sub_stream', toDisplayName(pageInfo.subStream));
      }
      
      // Add search filter
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      
      // Add type filter (Government/Private)
      if (filters.type) {
        queryParams.append('type', filters.type);
      }
      
      // Add fee filters
      if (filters.minFees) {
        queryParams.append('min_fees', filters.minFees);
      }
      if (filters.maxFees) {
        queryParams.append('max_fees', filters.maxFees);
      }
      
      const response = await api.get(`/colleges?${queryParams.toString()}`);
      let data = response.data || [];
      
      setInstitutions(data);
      setTotalCount(data.length);
      setPagination(prev => ({ ...prev, total: data.length }));
    } catch (error) {
      console.error('Error fetching institutions:', error);
      setInstitutions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search with debounce
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  
  // Breadcrumb generation
  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: 'Home', path: '/' }];
    
    if (urlInfo.type === 'institution-listing') {
      if (urlInfo.location) {
        const typeName = urlInfo.institutionType === 'colleges' ? 'Colleges' 
          : urlInfo.institutionType === 'schools' ? 'Schools' : 'Universities';
        crumbs.push({ 
          label: `India ${typeName}`, 
          path: `/india-${urlInfo.institutionType}` 
        });
        crumbs.push({ 
          label: `${toDisplayName(urlInfo.location)} ${typeName}`, 
          path: location.pathname 
        });
      } else {
        crumbs.push({ label: pageInfo.title, path: location.pathname });
      }
    } else if (urlInfo.type === 'stream-listing') {
      crumbs.push({ label: 'Colleges', path: '/india-colleges' });
      if (pageInfo.stream) {
        crumbs.push({ label: `${toDisplayName(pageInfo.stream)} Colleges`, path: `/${pageInfo.stream}` });
      }
      if (pageInfo.subStream && !isState(pageInfo.subStream) && !isCity(pageInfo.subStream)) {
        crumbs.push({ label: toDisplayName(pageInfo.subStream), path: `/${pageInfo.stream}/${pageInfo.subStream}` });
      }
      if (pageInfo.location) {
        crumbs.push({ label: toDisplayName(pageInfo.location), path: location.pathname });
      }
    } else if (urlInfo.type === 'institution-location-listing') {
      crumbs.push({ label: pageInfo.title, path: location.pathname });
    }
    
    return crumbs;
  }, [urlInfo, pageInfo, location.pathname]);
  
  // Quick location links for sidebar
  const quickLocationLinks = useMemo(() => {
    const type = urlInfo.institutionType || 'colleges';
    return [
      { label: 'Delhi', path: getInstitutionListingUrl(type.replace(/s$/, ''), 'Delhi') },
      { label: 'Mumbai', path: getInstitutionListingUrl(type.replace(/s$/, ''), 'Mumbai') },
      { label: 'Bangalore', path: getInstitutionListingUrl(type.replace(/s$/, ''), 'Bangalore') },
      { label: 'Chennai', path: getInstitutionListingUrl(type.replace(/s$/, ''), 'Chennai') },
      { label: 'Pune', path: getInstitutionListingUrl(type.replace(/s$/, ''), 'Pune') },
      { label: 'Hyderabad', path: getInstitutionListingUrl(type.replace(/s$/, ''), 'Hyderabad') },
    ];
  }, [urlInfo.institutionType]);
  
  return (
    <>
      <Helmet>
        <title>{pageInfo.title} | AdmissionBuddy</title>
        <meta name="description" content={pageInfo.description} />
        <link rel="canonical" href={`https://admissionbuddy.co${location.pathname}`} />
      </Helmet>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm mb-4 text-orange-100 flex-wrap">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-white">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-white">{crumb.label}</Link>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{pageInfo.title}</h1>
          <p className="text-orange-100 max-w-2xl">{pageInfo.description}</p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 mt-4 text-sm flex-wrap">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {totalCount}+ Institutions Found
            </span>
            {pageInfo.stream && (
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Stream: {toDisplayName(pageInfo.stream)}
              </span>
            )}
            {pageInfo.location && (
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Location: {toDisplayName(pageInfo.location)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search institutions..."
                value={filters.search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-orange-50 border-orange-300 text-orange-600' : 'hover:bg-gray-50'}`}
            >
              <FiFilter size={16} />
              <span>Filters</span>
              <FiChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Quick Links */}
            <div className="hidden md:flex items-center gap-2 text-sm">
              {quickLocationLinks.slice(0, 4).map((link, idx) => (
                <Link 
                  key={idx}
                  to={link.path}
                  className="px-3 py-1 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t grid grid-cols-2 md:grid-cols-4 gap-3">
              <select
                value={filters.type}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, type: e.target.value }));
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="Deemed">Deemed</option>
              </select>
              
              <input
                type="number"
                placeholder="Min Fees (₹)"
                value={filters.minFees}
                onChange={(e) => setFilters(prev => ({ ...prev, minFees: e.target.value }))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              
              <input
                type="number"
                placeholder="Max Fees (₹)"
                value={filters.maxFees}
                onChange={(e) => setFilters(prev => ({ ...prev, maxFees: e.target.value }))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              
              <button
                onClick={() => {
                  fetchInstitutions();
                  setShowFilters(false);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            ) : institutions.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No institutions found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <Link to="/india-colleges" className="text-orange-600 hover:underline">
                  Browse all colleges →
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {institutions.map((inst, idx) => (
                  <Link 
                    key={inst.id || idx}
                    to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name)}
                    className="bg-white rounded-xl border hover:shadow-lg transition-all duration-200 p-4 flex gap-4 group"
                  >
                    {/* Logo */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {inst.logo_url ? (
                        <img src={inst.logo_url} alt={inst.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">
                          {inst.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-600 line-clamp-1 transition-colors">
                            {inst.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <FiMapPin size={14} />
                              {inst.location?.city}{inst.location?.state ? `, ${inst.location.state}` : ''}
                            </span>
                            {inst.type && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                {inst.type}
                              </span>
                            )}
                            {inst.institution_type && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">
                                {inst.institution_type}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Rating */}
                        {inst.rating > 0 && (
                          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                            <FiStar size={14} className="fill-current" />
                            <span className="font-semibold">{inst.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Info */}
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        {inst.nirf_ranking && (
                          <span className="text-gray-600">
                            <strong>NIRF:</strong> #{inst.nirf_ranking}
                          </span>
                        )}
                        {inst.average_fees > 0 && (
                          <span className="text-gray-600">
                            <strong>Fees:</strong> ₹{inst.average_fees >= 100000 ? `${(inst.average_fees / 100000).toFixed(1)}L` : `${(inst.average_fees / 1000).toFixed(0)}K`}/yr
                          </span>
                        )}
                        {inst.courses?.length > 0 && (
                          <span className="text-gray-600">
                            <strong>Courses:</strong> {Array.isArray(inst.courses) ? inst.courses.length : 0}
                          </span>
                        )}
                        {inst.total_students > 0 && (
                          <span className="text-gray-600">
                            <strong>Students:</strong> {inst.total_students.toLocaleString()}
                          </span>
                        )}
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {inst.is_verified && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">✓ Verified</span>
                        )}
                        {inst.is_featured && (
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">★ Featured</span>
                        )}
                        {inst.is_admission_open && (
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Admissions Open</span>
                        )}
                        {inst.accreditation && inst.accreditation.length > 0 && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full">
                            {Array.isArray(inst.accreditation) ? inst.accreditation[0] : inst.accreditation}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="flex flex-col items-end justify-between">
                      <button 
                        onClick={(e) => { e.preventDefault(); }}
                        className="text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        <FiBookmark size={20} />
                      </button>
                      <span className="text-orange-600 flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <FiArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && institutions.length > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-medium">
                  Page {pagination.page}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={institutions.length < pagination.limit}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-20 space-y-4">
              {/* Quick Location Links */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Browse by City</h3>
                <div className="space-y-2">
                  {quickLocationLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.path}
                      className="block px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Popular Streams */}
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Popular Streams</h3>
                <div className="flex flex-wrap gap-2">
                  {['engineering', 'mba', 'medical', 'law', 'arts', 'commerce'].map((stream) => (
                    <Link
                      key={stream}
                      to={`/${stream}`}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors"
                    >
                      {toDisplayName(stream)}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Need Help CTA */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-orange-100 mb-3">
                  Talk to our expert counselors for personalized guidance.
                </p>
                <Link
                  to="/counseling"
                  className="block w-full text-center px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  Book Free Session
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicListingPage;
