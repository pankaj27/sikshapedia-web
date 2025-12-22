import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCheckCircle, FiAward, FiEdit3, FiGrid, FiTarget, FiFilter, FiChevronDown, FiChevronUp, FiUser, FiSearch, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { FeaturedSponsoredSection } from '../components/SponsoredAds';

import { Link } from '../components/CustomLink';
const UniversitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState([]);
  const [sortBy, setSortBy] = useState('ranking');
  const itemsPerPage = 20;

  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: [],
    minFees: '',
    maxFees: '',
    course: '',
    exam: '',
    rating: '',
    universityType: '',
    accreditation: '',
    stream: '',
  });

  // State for horizontal filter dropdowns
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);

  useEffect(() => {
    fetchUniversities();
  }, [searchParams, sortBy]);

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

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/universities?${searchParams.toString()}&sort=${sortBy}`);
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.state) params.append('state', filters.state);
    if (filters.type.length > 0) params.append('type', filters.type.join(','));
    if (filters.minFees) params.append('minFees', filters.minFees);
    if (filters.maxFees) params.append('maxFees', filters.maxFees);
    if (filters.course) params.append('course', filters.course);
    if (filters.exam) params.append('exam', filters.exam);
    if (filters.rating) params.append('rating', filters.rating);
    setSearchParams(params);
    setCurrentPage(1);
  };

  const toggleFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  const toggleCompare = (universityId) => {
    setCompareList(prev => 
      prev.includes(universityId) 
        ? prev.filter(id => id !== universityId)
        : prev.length < 4 ? [...prev, universityId] : prev
    );
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      type: [],
      minFees: '',
      maxFees: '',
      course: '',
      exam: '',
      rating: '',
      universityType: '',
      accreditation: '',
      stream: '',
    });
    setSearchParams(new URLSearchParams());
  };

  const filterOptions = {
    universityType: ['Central University', 'State University', 'Private University', 'Deemed University', 'Institute of National Importance'],
    accreditation: ['NAAC A++', 'NAAC A+', 'NAAC A', 'NAAC B++', 'NBA Accredited', 'UGC Approved'],
    stream: ['Engineering', 'Medical', 'Management', 'Law', 'Arts', 'Science', 'Commerce', 'Agriculture'],
    state: ['Maharashtra', 'Tamil Nadu', 'Delhi', 'Karnataka', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Gujarat'],
    city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad'],
  };

  // Handle filter selection
  const handleFilterSelect = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setActiveFilterDropdown(null);
    // Trigger search with new filter
    setTimeout(() => {
      applyFilters();
    }, 100);
  };

  // Remove a specific filter
  const removeFilter = (filterType) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: ''
    }));
    setTimeout(() => {
      applyFilters();
    }, 100);
  };

  const paginatedUniversities = universities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(universities.length / itemsPerPage);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      {/* BREADCRUMB NAVIGATION - Compact */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">All Universities in India</span>
          </div>
        </div>
      </div>

      {/* PAGE HEADING - Compact */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-1.5">
          <h1 className="text-xl font-bold text-gray-900">Top Universities in India 2025</h1>
        </div>
      </div>

      {/* ADVERTISEMENT BANNERS - Compact */}
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

      {/* AUTHOR INFO - Compact */}
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

      {/* Featured Universities Sponsored Section */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-6">
          <FeaturedSponsoredSection 
            placementId="university_listing_featured"
            title="Featured Universities"
            subtitle="Top sponsored universities with excellent programs"
            bgColor="from-purple-50 via-violet-50 to-indigo-50"
            headerColor="from-purple-600 to-violet-600"
            linkColor="text-purple-600"
            viewAllLink="/university"
          />
        </div>
      </div>

      {/* COLLEGE LISTING SECTION */}
      <div className="bg-gray-50 py-6 border-t-4 border-orange-600">
        <div className="container mx-auto px-6">
          <div className="flex gap-6">
            
            {/* FILTERS SIDEBAR */}
            <aside className={`w-80 flex-shrink-0 transition-all ${showFilters ? '' : 'hidden'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FiFilter className="text-orange-600" /> Filters
                  </h3>
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* College Type */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">College Type</label>
                    <div className="space-y-2">
                      {['Government', 'Private', 'Deemed'].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                          <input 
                            type="checkbox"
                            checked={filters.type.includes(type)}
                            onChange={() => toggleFilter(type)}
                            className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">State</label>
                    <select
                      value={filters.state}
                      onChange={(e) => setFilters({...filters, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">All States</option>
                      <option value="Maharashtra">Maharashtra (511)</option>
                      <option value="Tamil Nadu">Tamil Nadu (621)</option>
                      <option value="Delhi">Delhi (355)</option>
                      <option value="Karnataka">Karnataka (294)</option>
                      <option value="Uttar Pradesh">Uttar Pradesh (445)</option>
                    </select>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">City</label>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({...filters, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">All Cities</option>
                      <option value="Mumbai">Mumbai (245)</option>
                      <option value="Delhi">Delhi (234)</option>
                      <option value="Bangalore">Bangalore (144)</option>
                      <option value="Chennai">Chennai (126)</option>
                      <option value="Pune">Pune (129)</option>
                    </select>
                  </div>

                  {/* Course */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Course</label>
                    <select
                      value={filters.course}
                      onChange={(e) => setFilters({...filters, course: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">All Courses</option>
                      <option value="btech">B.Tech</option>
                      <option value="mbbs">MBBS</option>
                      <option value="mba">MBA</option>
                      <option value="bcom">B.Com</option>
                      <option value="bsc">B.Sc</option>
                    </select>
                  </div>

                  {/* Entrance Exam */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Entrance Exam</label>
                    <select
                      value={filters.exam}
                      onChange={(e) => setFilters({...filters, exam: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">All Exams</option>
                      {/* Exam options populated dynamically */}
                    </select>
                  </div>

                  {/* Fees Range */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Annual Fees Range</label>
                    <div className="space-y-2">
                      <input 
                        type="number"
                        placeholder="Min Fees (₹)"
                        value={filters.minFees}
                        onChange={(e) => setFilters({...filters, minFees: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                      <input 
                        type="number"
                        placeholder="Max Fees (₹)"
                        value={filters.maxFees}
                        onChange={(e) => setFilters({...filters, maxFees: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Minimum Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">All Ratings</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </select>
                  </div>

                  <Button 
                    onClick={applyFilters}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </aside>

            {/* MAIN LISTING */}
            <main className="flex-1">
              {/* HORIZONTAL FILTER BAR - Compact */}
              <div className="bg-white rounded-lg shadow-sm p-2.5 mb-4 relative">
                {/* Primary Filters Row - Compact */}
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FiFilter size={12} />
                    All Filter
                  </button>
                  
                  {/* University Type Filter */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'universityType' ? null : 'universityType')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        filters.universityType ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filters.universityType || 'University Type'}
                      <FiChevronDown size={12} />
                    </button>
                    {activeFilterDropdown === 'universityType' && (
                      <div className="absolute top-full left-0 mt-1 w-60 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                        {filterOptions.universityType.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('universityType', option)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          >
                            {option}
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
                        filters.state ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filters.state || 'State'}
                      <FiChevronDown size={12} />
                    </button>
                    {activeFilterDropdown === 'state' && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                        {filterOptions.state.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('state', option)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Stream Filter */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'stream' ? null : 'stream')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        filters.stream ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filters.stream || 'Stream'}
                      <FiChevronDown size={12} />
                    </button>
                    {activeFilterDropdown === 'stream' && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                        {filterOptions.stream.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('stream', option)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* City Filter */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'city' ? null : 'city')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        filters.city ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filters.city || 'City'}
                      <FiChevronDown size={12} />
                    </button>
                    {activeFilterDropdown === 'city' && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                        {filterOptions.city.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('city', option)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Accreditation Filter */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'accreditation' ? null : 'accreditation')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        filters.accreditation ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filters.accreditation || 'Accreditation'}
                      <FiChevronDown size={12} />
                    </button>
                    {activeFilterDropdown === 'accreditation' && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-60 overflow-y-auto">
                        {filterOptions.accreditation.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('accreditation', option)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Applied Filters Display */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* University Type Filter */}
                  {filters.universityType && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                      {filters.universityType}
                      <button onClick={() => removeFilter('universityType')} className="hover:bg-orange-600 rounded-full">
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                  
                  {/* State Filter */}
                  {filters.state && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                      {filters.state}
                      <button onClick={() => removeFilter('state')} className="hover:bg-orange-600 rounded-full">
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                  
                  {/* City Filter */}
                  {filters.city && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                      {filters.city}
                      <button onClick={() => removeFilter('city')} className="hover:bg-orange-600 rounded-full">
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                  
                  {/* Stream Filter */}
                  {filters.stream && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                      {filters.stream}
                      <button onClick={() => removeFilter('stream')} className="hover:bg-orange-600 rounded-full">
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                  
                  {/* Accreditation Filter */}
                  {filters.accreditation && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                      {filters.accreditation}
                      <button onClick={() => removeFilter('accreditation')} className="hover:bg-orange-600 rounded-full">
                        <FiX size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </div>

              {/* Top Controls Bar */}
              <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm shadow-sm"
                  >
                    <FiFilter />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {loading ? 'Loading...' : `${universities.length} Universities Found`}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                  >
                    <option value="ranking">Sort by: Ranking</option>
                    <option value="fees-low">Fees: Low to High</option>
                    <option value="fees-high">Fees: High to Low</option>
                    <option value="rating">Rating: High to Low</option>
                    <option value="placement">Placement: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Compare Bar */}
              {compareList.length > 0 && (
                <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{compareList.length} colleges selected for comparison</span>
                      <Button 
                        size="sm"
                        onClick={() => window.open(`/compare?ids=${compareList.join(',')}`, '_blank')}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Compare Now
                      </Button>
                    </div>
                    <button onClick={() => setCompareList([])} className="text-sm text-gray-600 hover:text-gray-900">
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {/* COLLEGE TABLE */}
              {loading ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading universities...</p>
                </div>
              ) : universities.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <FiSearch className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 text-lg mb-2">No universities found</p>
                  <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search criteria</p>
                  <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
                </div>
              ) : (
                <>
                  {/* TABLE */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <table className="w-full">
                      {/* TABLE HEADER */}
                      <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-24">AB Ranking</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Colleges</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-32">Course Fees</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-40">Placement</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-32">User Reviews</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-32">Ranking</th>
                        </tr>
                      </thead>
                      
                      {/* TABLE BODY */}
                      <tbody>
                        {paginatedUniversities.map((university, index) => {
                          const globalIndex = (currentPage - 1) * itemsPerPage + index;
                          const isInCompare = compareList.includes(university.id);
                          
                          return (
                            <React.Fragment key={university.id}>
                              <tr className="border-b border-gray-200 hover:bg-orange-50 transition-colors">
                                {/* AB RANKING */}
                                <td className="px-3 py-3 align-top">
                                  <div className="flex flex-col items-center">
                                    <div className="text-xl font-bold text-orange-600">#{globalIndex + 1}</div>
                                  </div>
                                </td>

                                {/* COLLEGES */}
                                <td className="px-3 py-3 align-top">
                                  <div className="max-w-md">
                                    <div className="flex items-start gap-2 mb-1">
                                      {/* College Logo */}
                                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                                        {university.images?.[0] ? (
                                          <img src={university.images[0]} alt={university.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                            {university.name.charAt(0)}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <Link to={`/universities/${university.id}`} className="text-sm font-semibold text-blue-600 hover:underline leading-tight block mb-1">
                                          {university.name}
                                        </Link>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-600 mb-1">
                                      <FiMapPin className="text-orange-600 flex-shrink-0" size={11} />
                                      <span>{university.location?.city}, {university.location?.state}</span>
                                      <span className="text-gray-400">|</span>
                                      <span className="text-gray-700 font-medium">{university.type}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-600 mb-2">{university.accreditations?.length > 0 ? university.accreditations.join(', ') : ''}{university.recognized_by?.length > 0 ? (university.accreditations?.length > 0 ? ' | ' : '') + university.recognized_by.join(', ') : ''}</div>
                                    {/* Action Links Row */}
                                    <div className="flex items-center flex-wrap gap-3 mb-1">
                                      <Link to={`/universities/${university.id}`} className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 text-xs font-medium">
                                        <span>→</span>
                                        <span>Apply Now</span>
                                      </Link>
                                      <Link to={`/universities/${university.id}`} className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 text-xs font-medium">
                                        <span>↓</span>
                                        <span>Download Brochure</span>
                                      </Link>
                                      {/* Admission Open Badge */}
                                      <span className="inline-flex items-center bg-green-50 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-medium border border-green-300">
                                        🎓 Admission Open
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      <label className="inline-flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer hover:text-gray-900">
                                        <input
                                          type="checkbox"
                                          checked={isInCompare}
                                          onChange={() => toggleCompare(university.id)}
                                          className="w-3.5 h-3.5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        />
                                        <span>Add To Compare</span>
                                      </label>
                                    </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* COURSE FEES */}
                                <td className="px-3 py-3 align-top">
                                  <div>
                                    <div className="text-sm font-bold text-gray-900 mb-0.5">
                                      ₹{(university.average_fees / 100000).toFixed(2)}L
                                    </div>
                                    <div className="text-[9px] text-gray-500 mb-1">1st Year Fees</div>
                                    <Link to={`/universities/${university.id}#fees`} className="text-[10px] text-blue-600 hover:underline">
                                      Compare Fees
                                    </Link>
                                  </div>
                                </td>

                                {/* PLACEMENT */}
                                <td className="px-3 py-3 align-top">
                                  <div>
                                    <div className="text-[9px] text-gray-500 mb-0.5">Average Package</div>
                                    <div className="text-[13px] font-bold text-green-600 mb-1.5">
                                      ₹{university.placement?.average ? (university.placement.average / 100000).toFixed(1) : 'N/A'}L
                                    </div>
                                    <div className="text-[9px] text-gray-500 mb-0.5">Highest Package</div>
                                    <div className="text-[13px] font-bold text-gray-900 mb-1">
                                      ₹{university.placement?.highest ? (university.placement.highest / 100000).toFixed(1) : 'N/A'}L
                                    </div>
                                    <Link to={`/universities/${university.id}#placement`} className="text-[10px] text-blue-600 hover:underline">
                                      Compare Placement
                                    </Link>
                                  </div>
                                </td>

                                {/* USER REVIEWS - Only show if rating exists */}
                                <td className="px-3 py-3 align-top">
                                  <div>
                                    {university.rating > 0 ? (
                                      <>
                                        <div className="flex items-baseline gap-0.5 mb-0.5">
                                          <span className="text-base font-bold text-gray-900">{university.rating.toFixed(1)}</span>
                                          <span className="text-gray-500 text-[10px]">/5</span>
                                        </div>
                                        <div className="flex gap-0.5 mb-1">
                                          {[...Array(5)].map((_, i) => (
                                            <FiStar 
                                              key={i} 
                                              className={`${i < Math.floor(university.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                              size={10} 
                                            />
                                          ))}
                                        </div>
                                        {university.total_reviews > 0 && (
                                          <div className="text-[9px] text-gray-500 mb-1">
                                            Based on {university.total_reviews} User<br />Reviews
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div className="text-[10px] text-gray-400">No reviews yet</div>
                                    )}
                                  </div>
                                </td>

                                {/* RANKING */}
                                <td className="px-3 py-3 align-top">
                                  <div>
                                    <div className="text-[10px] text-gray-600 mb-1">
                                      #{globalIndex + 1}th/500 in India
                                    </div>
                                    <div className="flex items-center gap-0.5 mb-1.5">
                                      <FiAward className="text-orange-600 flex-shrink-0" size={11} />
                                      <span className="text-[9px] font-bold text-gray-700">Collegedunia</span>
                                    </div>
                                    <div className="flex flex-wrap gap-0.5 mb-1">
                                      {['NIRF', 'IIRF', 'IT'].map((agency) => (
                                        <div key={agency} className="w-5 h-5 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                                          <span className="text-[8px] font-bold text-gray-700">{agency.slice(0, 2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <Link to={`/universities/${university.id}#ranking`} className="text-[10px] text-blue-600 hover:underline">
                                      + 4 More
                                    </Link>
                                  </div>
                                </td>
                              </tr>

                              {/* FEATURED BANNER */}
                              {(index + 1) % 3 === 0 && (index + 1) < paginatedUniversities.length && (
                                <tr className="bg-orange-50 border-b border-orange-200">
                                  <td colSpan="6" className="px-4 py-2">
                                    <div className="flex items-center gap-2 text-xs">
                                      <span className="font-bold text-orange-700">Sponsored</span>
                                      <span className="text-gray-400">|</span>
                                      <span className="text-gray-700">Featured College</span>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                      <Button
                        variant="outline"
                        onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToTop(); }}
                        disabled={currentPage === 1}
                        className="text-sm"
                      >
                        Previous
                      </Button>
                      
                      {/* Page Numbers */}
                      {[...Array(Math.min(10, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            onClick={() => { setCurrentPage(pageNum); scrollToTop(); }}
                            className={`text-sm min-w-[40px] ${
                              currentPage === pageNum 
                                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 10 && (
                        <>
                          <span className="text-gray-500 px-2">...</span>
                          <Button
                            variant={currentPage === totalPages ? 'default' : 'outline'}
                            onClick={() => { setCurrentPage(totalPages); scrollToTop(); }}
                            className={`text-sm min-w-[40px] ${
                              currentPage === totalPages 
                                ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToTop(); }}
                        disabled={currentPage === totalPages}
                        className="text-sm"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* NEWSLETTER SUBSCRIPTION - Compact */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-6">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-white text-sm mb-3">Get the latest updates on college admissions, exams, and education news</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white h-10"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-4 text-sm h-10">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversitiesPage;
