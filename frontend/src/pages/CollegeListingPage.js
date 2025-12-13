import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCheckCircle, FiAward, FiDollarSign, FiUsers, FiChevronDown, FiFilter } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('ranking');
  const itemsPerPage = 20;
  
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: [],
    minFees: '',
    maxFees: '',
  });

  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, [searchParams, sortBy]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.append('sort', sortBy);
      const response = await api.get(`/colleges?${params.toString()}`);
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
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
    setSearchParams(params);
  };

  const toggleFilter = (type) => {
    setFilters(prev => ({
      ...prev,
      type: prev.type.includes(type)
        ? prev.type.filter(t => t !== type)
        : [...prev.type, type]
    }));
  };

  const paginatedColleges = colleges.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(colleges.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Colleges in India 2025</h1>
          <p className="text-gray-600">Explore the best colleges with rankings, fees, placements, and admission details</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`w-72 flex-shrink-0 transition-all ${showFilters ? '' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiFilter /> Filters
                </h3>
                <button 
                  onClick={() => setFilters({ city: '', state: '', type: [], minFees: '', maxFees: '' })}
                  className="text-sm text-orange-600 hover:underline"
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
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
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
                  <label className="font-semibold text-sm mb-3 block text-gray-700">Location</label>
                  <input 
                    type="text"
                    placeholder="City"
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input 
                    type="text"
                    placeholder="State"
                    value={filters.state}
                    onChange={(e) => setFilters({...filters, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Fees Range */}
                <div>
                  <label className="font-semibold text-sm mb-3 block text-gray-700">Annual Fees Range</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      placeholder="Min"
                      value={filters.minFees}
                      onChange={(e) => setFilters({...filters, minFees: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input 
                      type="number"
                      placeholder="Max"
                      value={filters.maxFees}
                      onChange={(e) => setFilters({...filters, maxFees: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <Button 
                  onClick={applyFilters}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Top Bar */}
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiFilter />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <h2 className="text-lg font-semibold text-gray-800">
                  {loading ? 'Loading...' : `${colleges.length} Colleges Found`}
                </h2>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ranking">Sort by Ranking</option>
                <option value="fees-low">Fees: Low to High</option>
                <option value="fees-high">Fees: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            {/* College Cards */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center shadow-md">
                <p className="text-gray-600 text-lg">No colleges found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedColleges.map((college, index) => (
                    <div key={college.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
                      <div className="p-6">
                        <div className="flex gap-6">
                          {/* College Logo */}
                          <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg overflow-hidden flex items-center justify-center">
                            {college.images?.[0] ? (
                              <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-white text-2xl font-bold">
                                #{(page - 1) * itemsPerPage + index + 1}
                              </div>
                            )}
                          </div>

                          {/* College Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <Link 
                                    to={`/colleges/${college.id}`} 
                                    className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                                  >
                                    {college.name}
                                  </Link>
                                  {college.featured && (
                                    <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded">Featured</span>
                                  )}
                                  {college.verified && (
                                    <FiCheckCircle className="text-green-600" />
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <FiMapPin className="text-orange-600" />
                                    {college.location?.city}, {college.location?.state}
                                  </span>
                                  <span className="text-gray-400">|</span>
                                  <span className="text-blue-600 font-medium">{college.type}</span>
                                  {college.accreditation && (
                                    <>
                                      <span className="text-gray-400">|</span>
                                      <span>{college.accreditation}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {college.rating && (
                                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold">
                                  <FiStar className="fill-current" />
                                  {college.rating}/5
                                </div>
                              )}
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-4 gap-6 py-4 border-t border-b border-gray-200">
                              {/* Course Fees */}
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Course Fees</div>
                                <div className="text-lg font-bold text-gray-900">
                                  ₹{(college.average_fees / 100000).toFixed(2)}L
                                </div>
                                <div className="text-xs text-gray-500">1st Year Fees</div>
                              </div>

                              {/* Placement */}
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Average Package</div>
                                <div className="text-lg font-bold text-green-600">
                                  ₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : 'N/A'}L
                                </div>
                                <div className="text-xs text-gray-500">
                                  Highest: ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : 'N/A'}L
                                </div>
                              </div>

                              {/* User Reviews */}
                              <div>
                                <div className="text-xs text-gray-500 mb-1">User Reviews</div>
                                <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                  {college.rating || 'N/A'}/5
                                  <FiStar className="text-yellow-500 text-sm" />
                                </div>
                                <div className="text-xs text-gray-500">Based on {college.reviews || 0} reviews</div>
                              </div>

                              {/* Ranking */}
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Ranking</div>
                                <div className="text-lg font-bold text-orange-600 flex items-center gap-1">
                                  <FiAward />
                                  #{typeof college.ranking === 'object' ? college.ranking.nirf : college.ranking || 'N/A'}
                                </div>
                                <div className="text-xs text-gray-500">NIRF 2025</div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4">
                              <Link to={`/colleges/${college.id}`}>
                                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                  View Details
                                </Button>
                              </Link>
                              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                                Apply Now
                              </Button>
                              <Button variant="outline">
                                Download Brochure
                              </Button>
                              <Button variant="ghost" className="text-gray-600">
                                Compare
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          onClick={() => setPage(pageNum)}
                          className={page === pageNum ? 'bg-orange-600 hover:bg-orange-700' : ''}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && <span className="text-gray-500">...</span>}
                    {totalPages > 5 && (
                      <Button
                        variant={page === totalPages ? 'default' : 'outline'}
                        onClick={() => setPage(totalPages)}
                        className={page === totalPages ? 'bg-orange-600 hover:bg-orange-700' : ''}
                      >
                        {totalPages}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
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
  );
};

export default CollegeListingPage;