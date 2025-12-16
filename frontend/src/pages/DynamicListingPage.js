import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiFilter, FiSearch, FiChevronDown, FiStar, FiBookmark, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';
import { parseListingUrl, isState, isCity, INDIAN_STATES, INDIAN_CITIES, getInstitutionDetailUrl } from '../utils/urlHelpers';
import { generateSlug } from '../utils/slugify';

const DynamicListingPage = () => {
  const location = useLocation();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    state: '',
    city: ''
  });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  
  // Parse URL to determine what to show
  const urlInfo = parseListingUrl(location.pathname);
  
  // Determine page title and type from URL
  const getPageInfo = () => {
    if (urlInfo.type === 'institution-listing') {
      const locationName = urlInfo.location 
        ? urlInfo.location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'India';
      const typeName = urlInfo.institutionType.charAt(0).toUpperCase() + urlInfo.institutionType.slice(1);
      return {
        title: `Top ${typeName} in ${locationName}`,
        description: `Explore top ${urlInfo.institutionType} in ${locationName}. Find courses, fees, placements, rankings and more.`,
        institutionType: urlInfo.institutionType === 'colleges' ? 'College' 
          : urlInfo.institutionType === 'schools' ? 'School' : 'University',
        location: urlInfo.location
      };
    }
    
    if (urlInfo.type === 'institution-location-listing') {
      const locationName = urlInfo.location?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const typeName = urlInfo.institutionType.charAt(0).toUpperCase() + urlInfo.institutionType.slice(1) + 's';
      return {
        title: `Top ${typeName} in ${locationName}`,
        description: `Explore top ${typeName.toLowerCase()} in ${locationName}. Find admissions, fees, and more.`,
        institutionType: urlInfo.institutionType.charAt(0).toUpperCase() + urlInfo.institutionType.slice(1),
        location: urlInfo.location
      };
    }
    
    if (urlInfo.type === 'stream-listing') {
      const streamName = urlInfo.stream?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const subStreamName = urlInfo.subStream?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const locationName = urlInfo.location?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      let title = `Top ${streamName} Colleges`;
      if (subStreamName) title = `Top ${streamName} - ${subStreamName} Colleges`;
      if (locationName) title += ` in ${locationName}`;
      
      return {
        title,
        description: `Explore top colleges for ${streamName}${subStreamName ? ` - ${subStreamName}` : ''}${locationName ? ` in ${locationName}` : ''}.`,
        stream: urlInfo.stream,
        subStream: urlInfo.subStream,
        location: urlInfo.location
      };
    }
    
    return {
      title: 'Institutions',
      description: 'Explore top institutions in India'
    };
  };
  
  const pageInfo = getPageInfo();
  
  useEffect(() => {
    fetchInstitutions();
  }, [location.pathname, pagination.page]);
  
  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      let query = `?limit=${pagination.limit}&skip=${(pagination.page - 1) * pagination.limit}`;
      
      // Add type filter
      if (pageInfo.institutionType) {
        // Backend might filter by institution_type field
      }
      
      // Add location filter
      if (pageInfo.location) {
        const loc = pageInfo.location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (isState(pageInfo.location)) {
          query += `&state=${encodeURIComponent(loc)}`;
        } else if (isCity(pageInfo.location)) {
          query += `&city=${encodeURIComponent(loc)}`;
        }
      }
      
      // Add search filter
      if (filters.search) {
        query += `&search=${encodeURIComponent(filters.search)}`;
      }
      
      const response = await api.get(`/colleges${query}`);
      let data = response.data || [];
      
      // Client-side filtering for institution type if backend doesn't support it
      if (pageInfo.institutionType) {
        data = data.filter(inst => 
          inst.institution_type?.toLowerCase() === pageInfo.institutionType.toLowerCase()
        );
      }
      
      setInstitutions(data);
      setPagination(prev => ({ ...prev, total: data.length }));
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Home', path: '/' }];
    
    if (urlInfo.type === 'institution-listing') {
      if (urlInfo.location) {
        crumbs.push({ 
          label: `India ${urlInfo.institutionType.charAt(0).toUpperCase() + urlInfo.institutionType.slice(1)}`, 
          path: `/india-${urlInfo.institutionType}` 
        });
        crumbs.push({ 
          label: pageInfo.title, 
          path: location.pathname 
        });
      } else {
        crumbs.push({ label: pageInfo.title, path: location.pathname });
      }
    } else if (urlInfo.type === 'stream-listing') {
      crumbs.push({ label: 'Colleges', path: '/india-colleges' });
      crumbs.push({ label: pageInfo.title, path: location.pathname });
    }
    
    return crumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
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
          <nav className="flex items-center space-x-2 text-sm mb-4 text-orange-100">
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
          <p className="text-orange-100">{pageInfo.description}</p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {institutions.length}+ Institutions
            </span>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search institutions..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <FiFilter size={16} />
              <span>Filters</span>
              <FiChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : institutions.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No institutions found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {institutions.map((inst, idx) => (
              <Link 
                key={inst.id || idx}
                to={getInstitutionDetailUrl(inst.institution_type || 'college', inst.id, inst.name)}
                className="bg-white rounded-xl border hover:shadow-lg transition-shadow p-4 flex gap-4"
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
                      <h3 className="font-semibold text-lg text-gray-900 hover:text-orange-600 line-clamp-1">
                        {inst.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <FiMapPin size={14} />
                        <span>{inst.location?.city}, {inst.location?.state}</span>
                        {inst.type && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            {inst.type}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Rating */}
                    {inst.rating && (
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded">
                        <FiStar size={14} className="fill-current" />
                        <span className="font-semibold">{inst.rating}</span>
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
                    {inst.average_fees && (
                      <span className="text-gray-600">
                        <strong>Fees:</strong> ₹{(inst.average_fees / 100000).toFixed(1)}L/yr
                      </span>
                    )}
                    {inst.courses?.length > 0 && (
                      <span className="text-gray-600">
                        <strong>Courses:</strong> {inst.courses.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {inst.is_verified && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">Verified</span>
                    )}
                    {inst.is_featured && (
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full">Featured</span>
                    )}
                    {inst.is_admission_open && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">Admissions Open</span>
                    )}
                  </div>
                </div>
                
                {/* Action */}
                <div className="flex flex-col items-end justify-between">
                  <button className="text-gray-400 hover:text-orange-600">
                    <FiBookmark size={20} />
                  </button>
                  <span className="text-orange-600 flex items-center gap-1 text-sm font-medium">
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
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {pagination.page}</span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={institutions.length < pagination.limit}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DynamicListingPage;
