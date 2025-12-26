import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from '../components/CustomLink';
import { FiMapPin, FiStar, FiUsers, FiBookOpen, FiCheck, FiSearch, FiFilter, FiGrid, FiList } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { getInstitutionDetailUrl } from '../utils/urlHelpers';

const InstitutesPage = () => {
  const { location } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('all');
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ all: 0, colleges: 0, schools: 0, universities: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Convert slug to display name
  const locationName = useMemo(() => {
    if (!location) return 'India';
    return location
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [location]);

  // Fetch all institutes for this location
  useEffect(() => {
    const fetchInstitutes = async () => {
      setLoading(true);
      try {
        // Fetch from all three endpoints in parallel
        const [collegesRes, schoolsRes, universitiesRes] = await Promise.all([
          api.get(`/colleges?state=${encodeURIComponent(locationName)}&limit=100`).catch(() => ({ data: [] })),
          api.get(`/schools?state=${encodeURIComponent(locationName)}&limit=100`).catch(() => ({ data: [] })),
          api.get(`/universities?state=${encodeURIComponent(locationName)}&limit=100`).catch(() => ({ data: [] }))
        ]);

        const colleges = (collegesRes.data || []).map(c => ({ ...c, _type: 'college' }));
        const schools = (schoolsRes.data || []).map(s => ({ ...s, _type: 'school' }));
        const universities = (universitiesRes.data || []).map(u => ({ ...u, _type: 'university' }));

        // Also try fetching by city if state returns nothing
        if (colleges.length === 0 && schools.length === 0 && universities.length === 0) {
          const [collegesCityRes, schoolsCityRes, universitiesCityRes] = await Promise.all([
            api.get(`/colleges?city=${encodeURIComponent(locationName)}&limit=100`).catch(() => ({ data: [] })),
            api.get(`/schools?city=${encodeURIComponent(locationName)}&limit=100`).catch(() => ({ data: [] })),
            api.get(`/universities?city=${encodeURIComponent(locationName)}&limit=100`).catch(() => ({ data: [] }))
          ]);
          
          colleges.push(...(collegesCityRes.data || []).map(c => ({ ...c, _type: 'college' })));
          schools.push(...(schoolsCityRes.data || []).map(s => ({ ...s, _type: 'school' })));
          universities.push(...(universitiesCityRes.data || []).map(u => ({ ...u, _type: 'university' })));
        }

        const allInstitutes = [...colleges, ...schools, ...universities];
        
        setInstitutes(allInstitutes);
        setCounts({
          all: allInstitutes.length,
          colleges: colleges.length,
          schools: schools.length,
          universities: universities.length
        });
      } catch (error) {
        console.error('Error fetching institutes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutes();
  }, [locationName]);

  // Filter institutes based on active tab and search
  const filteredInstitutes = useMemo(() => {
    let filtered = institutes;
    
    // Filter by tab
    if (activeTab === 'colleges') {
      filtered = filtered.filter(i => i._type === 'college' || i.institution_type?.toLowerCase() === 'college');
    } else if (activeTab === 'schools') {
      filtered = filtered.filter(i => i._type === 'school' || i.institution_type?.toLowerCase() === 'school');
    } else if (activeTab === 'universities') {
      filtered = filtered.filter(i => i._type === 'university' || i.institution_type?.toLowerCase() === 'university');
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.name?.toLowerCase().includes(query) ||
        i.location?.city?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [institutes, activeTab, searchQuery]);

  // Get institute link
  const getInstituteLink = (institute) => {
    const type = institute._type || institute.institution_type?.toLowerCase() || 'college';
    return getInstitutionDetailUrl(type, institute.id, institute.name, institute.location?.city, institute.serial_number);
  };

  // Tab configuration
  const tabs = [
    { id: 'all', label: 'All', count: counts.all, icon: FiGrid },
    { id: 'colleges', label: 'Colleges', count: counts.colleges, icon: FiBookOpen },
    { id: 'schools', label: 'Schools', count: counts.schools, icon: FiUsers },
    { id: 'universities', label: 'Universities', count: counts.universities, icon: FiStar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span>Institutes</span>
            <span>/</span>
            <span className="text-white">{locationName}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Top Institutes in {locationName} 2026
          </h1>
          <p className="text-blue-100 text-lg mb-6">
            Explore {counts.all} Colleges, Schools & Universities in {locationName}
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-bold text-xl">{counts.colleges}</span>
              <span className="text-blue-200 ml-2">Colleges</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-bold text-xl">{counts.schools}</span>
              <span className="text-blue-200 ml-2">Schools</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-bold text-xl">{counts.universities}</span>
              <span className="text-blue-200 ml-2">Universities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex flex-wrap border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          {/* Search & View Controls */}
          <div className="p-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 relative min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search institutes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading institutes in {locationName}...</p>
          </div>
        ) : filteredInstitutes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No institutes found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No results for "${searchQuery}" in ${locationName}`
                : `No ${activeTab === 'all' ? 'institutes' : activeTab} found in ${locationName}`
              }
            </p>
            {searchQuery && (
              <Button onClick={() => setSearchQuery('')} variant="outline">Clear Search</Button>
            )}
            {activeTab !== 'all' && (
              <Button onClick={() => setActiveTab('all')} className="ml-2">View All Institutes</Button>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Showing {filteredInstitutes.length} {activeTab === 'all' ? 'institutes' : activeTab} in {locationName}
            </p>
            
            {/* Grid/List View */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredInstitutes.map((institute, idx) => (
                <Link
                  key={institute.id || idx}
                  to={getInstituteLink(institute)}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group ${
                    viewMode === 'list' ? 'flex items-center' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${
                    viewMode === 'grid' ? 'h-40' : 'w-32 h-32 flex-shrink-0'
                  }`}>
                    {institute.logo_url ? (
                      <img 
                        loading="lazy"
                        src={institute.logo_url} 
                        alt={institute.name}
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-blue-300">
                        {institute.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-1">
                    {/* Type Badge */}
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                      institute._type === 'school' ? 'bg-green-100 text-green-700' :
                      institute._type === 'university' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {institute._type === 'school' ? 'School' :
                       institute._type === 'university' ? 'University' : 'College'}
                    </span>
                    
                    {/* Name */}
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {institute.name}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                      <FiMapPin size={14} />
                      <span>
                        {institute.location?.city}
                        {institute.location?.state && `, ${institute.location.state}`}
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-sm">
                      {institute.rating > 0 && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <FiStar size={14} className="fill-current" />
                          {institute.rating?.toFixed(1)}
                        </span>
                      )}
                      {institute.type && (
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          institute.type === 'Government' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {institute.type}
                        </span>
                      )}
                      {institute.nirf_ranking && (
                        <span className="text-green-600 text-xs">
                          NIRF #{institute.nirf_ranking}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Quick Links */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-lg mb-4">Explore by Category</h3>
          <div className="flex flex-wrap gap-3">
            <Link 
              to={`/colleges/${location}/`}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
            >
              All Colleges in {locationName} →
            </Link>
            <Link 
              to={`/schools/${location}/`}
              className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
            >
              All Schools in {locationName} →
            </Link>
            <Link 
              to={`/university/${location}/`}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
            >
              All Universities in {locationName} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutesPage;
