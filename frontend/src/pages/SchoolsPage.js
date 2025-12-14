import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCheckCircle, FiAward, FiEdit3, FiGrid, FiTarget, FiFilter, FiChevronDown } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const SchoolsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState({
    city: '',
    state: '',
    board: [],
    minFees: '',
    maxFees: '',
  });

  useEffect(() => {
    fetchSchools();
  }, [searchParams]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/schools?${searchParams.toString()}`);
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.state) params.append('state', filters.state);
    if (filters.board.length > 0) params.append('board', filters.board.join(','));
    if (filters.minFees) params.append('minFees', filters.minFees);
    if (filters.maxFees) params.append('maxFees', filters.maxFees);
    setSearchParams(params);
  };

  const toggleFilter = (board) => {
    setFilters(prev => ({
      ...prev,
      board: prev.board.includes(board)
        ? prev.board.filter(b => b !== board)
        : [...prev.board, board]
    }));
  };

  const paginatedSchools = schools.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(schools.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-2">
      {/* BREADCRUMB NAVIGATION */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">All Schools in India</span>
          </div>
        </div>
      </div>

      {/* PAGE HEADING */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-2">
          <h1 className="text-2xl font-bold text-gray-900">Top Schools in India 2025</h1>
        </div>
      </div>

      {/* ADVERTISEMENT BANNERS */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/schools" className="block">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiEdit3 className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">Write a Review</h3>
                <p className="text-sm">Get Upto ₹300* - Share Your Experience</p>
              </div>
            </Link>
            <Link to="/courses" className="block">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiGrid className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">School Finder</h3>
                <p className="text-sm">Find Your Perfect School Match</p>
              </div>
            </Link>
            <Link to="/eligibility-checker" className="block">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiTarget className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">School Admission Predictor</h3>
                <p className="text-sm">Check Admission Chances</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION FOR SEO/RANKING */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-6">
          {/* Read More Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowContent(!showContent)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              {showContent ? (
                <>
                  <span>Read Less</span>
                  <FiChevronDown className="transform rotate-180" />
                </>
              ) : (
                <>
                  <span>Read More About Schools</span>
                  <FiChevronDown />
                </>
              )}
            </button>
          </div>

          {/* Collapsible Content */}
          <div className={`transition-all duration-300 overflow-hidden ${showContent ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Introductory Content */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Schools in India</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-4">
                India has a vast network of schools offering quality education from primary to secondary levels. 
                These institutions follow various boards including CBSE, ICSE, IB, and State Boards, providing 
                diverse educational approaches to suit different learning needs.
              </p>
            </div>
          </div>

          {/* Highlights Table */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Schools in India - Key Highlights</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50 w-1/3">Total Number of Schools</td>
                    <td className="px-6 py-4">50,000+</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Popular Boards</td>
                    <td className="px-6 py-4">CBSE, ICSE, IB, State Boards</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Fees Range</td>
                    <td className="px-6 py-4">₹10,000 - ₹5,00,000 per year</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold bg-gray-50">Average Board Result</td>
                    <td className="px-6 py-4">85% - 98%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* SCHOOL LISTING SECTION WITH FILTERS */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse All Schools</h2>
          
          <div className="flex gap-6">
            {/* LEFT SIDEBAR - FILTERS */}
            <aside className={`w-80 flex-shrink-0 transition-all ${showFilters ? '' : 'hidden'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FiFilter className="text-purple-600" /> Filters
                  </h3>
                  <button 
                    onClick={() => setFilters({ city: '', state: '', board: [], minFees: '', maxFees: '' })}
                    className="text-sm text-purple-600 hover:underline font-medium"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Board */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Board</label>
                    <div className="space-y-2">
                      {['CBSE', 'ICSE', 'IB', 'State Board'].map(board => (
                        <label key={board} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={filters.board.includes(board)}
                            onChange={() => toggleFilter(board)}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{board}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Location</label>
                    <select
                      value={filters.state}
                      onChange={(e) => setFilters({...filters, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({...filters, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select City</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                    </select>
                  </div>

                  {/* Fees Range */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Annual Fees Range (₹)</label>
                    <div className="space-y-2">
                      <input 
                        type="number"
                        placeholder="Min Fees"
                        value={filters.minFees}
                        onChange={(e) => setFilters({...filters, minFees: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                      <input 
                        type="number"
                        placeholder="Max Fees"
                        value={filters.maxFees}
                        onChange={(e) => setFilters({...filters, maxFees: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={applyFilters}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT - SCHOOL LISTING */}
            <main className="flex-1">
              {/* Top Bar */}
              <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm"
                  >
                    <FiFilter />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </button>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {loading ? 'Loading...' : `${schools.length} Schools Found`}
                  </h3>
                </div>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm">
                  <option>Sort by: Ranking</option>
                  <option>Fees: Low to High</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>

              {/* School Cards */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                      <div className="flex gap-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : schools.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-md">
                  <p className="text-gray-600 text-lg">No schools found. Try adjusting your filters.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedSchools.map((school, index) => (
                      <div key={school.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border">
                        <div className="p-6">
                          <div className="flex gap-6">
                            {/* Rank & Logo */}
                            <div className="flex flex-col items-center">
                              <div className="text-2xl font-bold text-gray-400 mb-2">#{index + 1}</div>
                              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                                {school.images?.[0] ? (
                                  <img src={school.images[0]} alt={school.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">{school.name.charAt(0)}</span>
                                )}
                              </div>
                            </div>

                            {/* School Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Link to={`/schools/${school.id}`} className="text-xl font-bold text-blue-600 hover:underline">
                                      {school.name}
                                    </Link>
                                    {school.featured && (
                                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-semibold">Featured</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <FiMapPin className="text-purple-600" />
                                    <span>{school.location?.city}, {school.location?.state}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="font-medium">{school.board || 'CBSE'}</span>
                                  </div>
                                </div>
                                {school.rating && (
                                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold">
                                    <FiStar className="fill-current" />
                                    {school.rating}/5
                                  </div>
                                )}
                              </div>

                              {/* Metrics Grid */}
                              <div className="grid grid-cols-3 gap-6 py-4 border-t border-b border-gray-200 mb-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Annual Fees</div>
                                  <div className="text-lg font-bold text-gray-900">
                                    ₹{school.fees ? (school.fees / 100000).toFixed(2) : (school.average_fees / 100000).toFixed(2)}L
                                  </div>
                                  <div className="text-xs text-gray-500">Per Year</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Board Results</div>
                                  <div className="text-lg font-bold text-green-600">{school.results || '95'}%</div>
                                  <div className="text-xs text-gray-500">Pass Rate</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Ranking</div>
                                  <div className="flex items-center gap-1 text-purple-600 font-bold">
                                    <FiAward />
                                    <span>#{index + 1}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">India 2025</div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-3">
                                <Link to={`/schools/${school.id}`}>
                                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Apply Now
                                  </Button>
                                </Link>
                                <Button variant="outline">Download Brochure</Button>
                                <Button variant="ghost" className="text-gray-600">Compare</Button>
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
                      {[...Array(Math.min(5, totalPages))].map((_, i) => (
                        <Button
                          key={i + 1}
                          variant={page === i + 1 ? 'default' : 'outline'}
                          onClick={() => setPage(i + 1)}
                          className={page === i + 1 ? 'bg-purple-600 hover:bg-purple-700' : ''}
                        >
                          {i + 1}
                        </Button>
                      ))}
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
    </div>
  );
};

export default SchoolsPage;
