import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiMapPin, FiGlobe, FiDollarSign, FiAward, FiCalendar, FiUsers, FiStar, FiChevronRight } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const StudyAbroadPage = () => {
  const [universities, setUniversities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const response = await api.get('/study-abroad/countries/list');
      setCountries(response.data.countries || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    }
  };

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCountry) params.append('country', selectedCountry);
      params.append('limit', '100');
      
      const response = await api.get(`/study-abroad?${params.toString()}`);
      const data = Array.isArray(response.data) ? response.data : [];
      
      // Filter only active universities
      const activeUniversities = data.filter(uni => uni.is_active !== false);
      setUniversities(activeUniversities);
      setTotalCount(activeUniversities.length);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchUniversities();
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(`/study-abroad?search=${encodeURIComponent(searchQuery)}`);
      const data = Array.isArray(response.data) ? response.data : [];
      const activeUniversities = data.filter(uni => uni.is_active !== false);
      setUniversities(activeUniversities);
      setTotalCount(activeUniversities.length);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely get nested values
  const getRanking = (uni) => {
    if (uni.ranking?.world) return uni.ranking.world;
    if (typeof uni.ranking === 'number') return uni.ranking;
    return null;
  };

  const getTuition = (uni) => {
    if (uni.tuition_fees?.min) {
      const currency = uni.tuition_fees.currency || 'USD';
      return `${currency} ${uni.tuition_fees.min.toLocaleString()}`;
    }
    return 'Contact for fees';
  };

  const getAcceptanceRate = (uni) => {
    if (uni.acceptance_rate) {
      return `${uni.acceptance_rate}%`;
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Study Abroad - Top Universities Worldwide | Admissionbuddy</title>
        <meta name="description" content="Explore top universities around the world for your study abroad journey. Find programs, tuition fees, and admission requirements." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Study Abroad</h1>
            <p className="text-base md:text-lg mb-6 text-indigo-100">
              Explore top universities around the world and find your perfect study destination
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search universities, cities, or countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-10 text-sm bg-white text-gray-900"
                  />
                </div>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 h-10 px-5">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Countries Filter */}
      {countries.length > 0 && (
        <section className="bg-white border-b shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCountry('')}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition font-medium ${
                  selectedCountry === '' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Countries
              </button>
              {countries.map(country => (
                <button
                  key={country}
                  onClick={() => setSelectedCountry(country)}
                  className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition font-medium ${
                    selectedCountry === country 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Count */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `Showing ${universities.length} universities`}
            {selectedCountry && ` in ${selectedCountry}`}
          </p>
        </div>
      </div>

      {/* Universities Grid */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow animate-pulse">
                  <div className="h-28 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm">
              <FiGlobe className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Universities Found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? `No results found for "${searchQuery}"`
                  : selectedCountry 
                    ? `No universities listed for ${selectedCountry} yet`
                    : 'No universities have been added yet'
                }
              </p>
              {(searchQuery || selectedCountry) && (
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchQuery(''); setSelectedCountry(''); fetchUniversities(); }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((uni) => (
                <div 
                  key={uni.id} 
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  {/* Header with gradient or logo */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-28 relative">
                    {uni.logo && (
                      <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                        <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center p-2">
                          <img 
                            src={uni.logo} 
                            alt={`${uni.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                    {/* Ranking Badge */}
                    {getRanking(uni) && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-white/95 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                          <FiAward className="text-yellow-500" />
                          #{getRanking(uni)} World
                        </span>
                      </div>
                    )}
                    {/* Featured Badge */}
                    {uni.is_featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <FiStar className="text-xs" /> Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`p-5 ${uni.logo ? 'pt-10' : 'pt-5'}`}>
                    {/* University Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {uni.name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <FiMapPin className="text-indigo-500 flex-shrink-0" />
                      <span>{uni.city}, {uni.country}</span>
                    </div>

                    {/* Description */}
                    {uni.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {uni.description}
                      </p>
                    )}

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                          <FiDollarSign className="text-green-500" />
                          Tuition/Year
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {getTuition(uni)}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5">
                          <FiUsers className="text-blue-500" />
                          Acceptance
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {getAcceptanceRate(uni)}
                        </div>
                      </div>
                    </div>

                    {/* Programs */}
                    {uni.programs?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {uni.programs.slice(0, 3).map((program, idx) => (
                          <span 
                            key={idx} 
                            className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium"
                          >
                            {program}
                          </span>
                        ))}
                        {uni.programs.length > 3 && (
                          <span className="text-xs text-gray-500 py-1">
                            +{uni.programs.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Deadline if available */}
                    {uni.application_deadline && (
                      <div className="flex items-center gap-2 text-xs text-orange-600 mb-4 bg-orange-50 px-3 py-2 rounded-lg">
                        <FiCalendar />
                        <span>Deadline: {uni.application_deadline}</span>
                      </div>
                    )}

                    {/* Action Button */}
                    {uni.website ? (
                      <a 
                        href={uni.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-9 text-sm">
                          <FiGlobe className="mr-2" /> Visit Website
                        </Button>
                      </a>
                    ) : (
                      <Button className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 h-9 text-sm" disabled>
                        Website Not Available
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {universities.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-indigo-600 to-purple-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Need Help Choosing the Right University?
            </h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Our expert counselors can help you find the perfect study abroad destination based on your goals and preferences.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/counseling">
                <Button className="bg-white text-indigo-700 hover:bg-gray-100">
                  Get Free Counseling
                </Button>
              </Link>
              <Link to="/scholarships">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-700">
                  Find Scholarships
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default StudyAbroadPage;
