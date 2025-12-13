import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCheckCircle, FiAward, FiEdit3, FiGrid, FiTarget, FiFilter, FiChevronDown } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: [],
    minFees: '',
    maxFees: '',
    course: '',
  });

  useEffect(() => {
    fetchColleges();
  }, [searchParams]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/colleges?${searchParams.toString()}`);
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
    if (filters.course) params.append('course', filters.course);
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
      {/* PAGE HEADING */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Top Colleges in India 2025</h1>
          <p className="text-gray-600 text-lg">
            Discover the best colleges in India with comprehensive rankings, fees structure, placement records, 
            and admission details. Compare top institutions and make an informed decision for your future.
          </p>
        </div>
      </div>

      {/* ADVERTISEMENT BANNERS */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/colleges" className="block">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiEdit3 className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">Write a Review</h3>
                <p className="text-sm">Get Upto ₹300* - Share Your Experience</p>
              </div>
            </Link>
            <Link to="/courses" className="block">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiGrid className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">Course Finder</h3>
                <p className="text-sm">Find Your Perfect Course Match</p>
              </div>
            </Link>
            <Link to="/eligibility-checker" className="block">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiTarget className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">College Predictor</h3>
                <p className="text-sm">Predict Your Admission Chances</p>
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
            >
              {showContent ? (
                <>
                  <span>Read Less</span>
                  <FiChevronDown className="transform rotate-180" />
                </>
              ) : (
                <>
                  <span>Read More About Colleges</span>
                  <FiChevronDown />
                </>
              )}
            </button>
          </div>

          {/* Collapsible Content */}
          <div className={`transition-all duration-300 overflow-hidden ${showContent ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Introductory Content */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Colleges in India</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-4">
                India is home to over 4,359 colleges offering diverse programs across engineering, medicine, management, 
                arts, and sciences. These institutions include 676 government colleges and 3,623 private colleges, 
                providing quality education to millions of students annually.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                The higher education landscape in India features prestigious institutions like IITs, NITs, IIMs, 
                and AIIMS that consistently rank among the top in the world. With fees ranging from ₹10,000 to ₹40 Lakh 
                and placement packages from ₹3 LPA to ₹25 LPA, students have a wide variety of options to choose from.
              </p>
            </div>
          </div>

          {/* Featured Image/Video Section */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-gray-200">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <FiGrid className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Video: Complete Guide to College Admissions 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Table */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Colleges in India - Key Highlights</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50 w-1/3">Total Number of Colleges</td>
                    <td className="px-6 py-4">4,359</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Government Colleges</td>
                    <td className="px-6 py-4">676</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Private Colleges</td>
                    <td className="px-6 py-4">3,623</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Top Ranked College</td>
                    <td className="px-6 py-4">
                      <Link to="/colleges/iit-bombay" className="text-blue-600 hover:underline font-medium">
                        IIT Bombay - Mumbai, Maharashtra
                      </Link>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Fees Range</td>
                    <td className="px-6 py-4">₹10,000 - ₹40,00,000 per year</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Average Package Range</td>
                    <td className="px-6 py-4">₹3 LPA - ₹25 LPA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold bg-gray-50">Popular Courses</td>
                    <td className="px-6 py-4">B.Tech, MBBS, MBA, B.Com, B.Sc, BBA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Colleges Overview Table */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top 10 Colleges in India 2025</h2>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">College Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fees (₹)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Avg Package</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: 'IIT Bombay', location: 'Mumbai, Maharashtra', type: 'Government', fees: '2.00L', package: '20.34L' },
                    { rank: 2, name: 'AIIMS Delhi', location: 'New Delhi, Delhi', type: 'Government', fees: '0.10L', package: '18.50L' },
                    { rank: 3, name: 'IIT Delhi', location: 'New Delhi, Delhi', type: 'Government', fees: '2.54L', package: '19.27L' },
                    { rank: 4, name: 'IIM Ahmedabad', location: 'Ahmedabad, Gujarat', type: 'Government', fees: '25.00L', package: '32.79L' },
                    { rank: 5, name: 'IIT Madras', location: 'Chennai, Tamil Nadu', type: 'Government', fees: '2.18L', package: '18.58L' },
                    { rank: 6, name: 'IIT Kanpur', location: 'Kanpur, Uttar Pradesh', type: 'Government', fees: '2.09L', package: '17.82L' },
                    { rank: 7, name: 'IIT Kharagpur', location: 'Kharagpur, West Bengal', type: 'Government', fees: '2.42L', package: '16.50L' },
                    { rank: 8, name: 'BHU Varanasi', location: 'Varanasi, Uttar Pradesh', type: 'Government', fees: '0.48L', package: '12.40L' },
                    { rank: 9, name: 'DU Delhi', location: 'New Delhi, Delhi', type: 'Government', fees: '0.15L', package: '8.92L' },
                    { rank: 10, name: 'BITS Pilani', location: 'Pilani, Rajasthan', type: 'Private', fees: '4.94L', package: '15.30L' },
                  ].map((college) => (
                    <tr key={college.rank} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-orange-600">#{college.rank}</td>
                      <td className="px-6 py-4">
                        <Link to={`/colleges/${college.rank}`} className="text-blue-600 hover:underline font-medium">
                          {college.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{college.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          college.type === 'Government' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {college.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">₹{college.fees}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">₹{college.package}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular Courses Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Popular Courses in India</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'B.Tech/Engineering', colleges: '2,547', avgFees: '₹1.2L - ₹15L' },
                { name: 'MBBS/Medical', colleges: '612', avgFees: '₹0.5L - ₹25L' },
                { name: 'MBA/Management', colleges: '3,876', avgFees: '₹2L - ₹25L' },
                { name: 'B.Com/Commerce', colleges: '2,134', avgFees: '₹15K - ₹3L' },
                { name: 'B.Sc/Science', colleges: '1,945', avgFees: '₹20K - ₹4L' },
                { name: 'BBA/Business', colleges: '1,523', avgFees: '₹50K - ₹8L' },
              ].map((course, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{course.colleges} Colleges</p>
                  <p className="text-sm font-semibold text-orange-600">Fees: {course.avgFees}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top States/Cities Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Top States</h3>
              <div className="bg-white rounded-lg shadow-md border">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">State</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Colleges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { state: 'Maharashtra', count: '612' },
                      { state: 'Tamil Nadu', count: '587' },
                      { state: 'Karnataka', count: '453' },
                      { state: 'Uttar Pradesh', count: '425' },
                      { state: 'Delhi', count: '347' },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-3">{item.state}</td>
                        <td className="px-4 py-3 font-semibold text-orange-600">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Top Cities</h3>
              <div className="bg-white rounded-lg shadow-md border">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">City</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Colleges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { city: 'Mumbai', count: '245' },
                      { city: 'Delhi', count: '234' },
                      { city: 'Bangalore', count: '198' },
                      { city: 'Chennai', count: '176' },
                      { city: 'Pune', count: '165' },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-3">{item.city}</td>
                        <td className="px-4 py-3 font-semibold text-orange-600">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Admission Information */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">College Admission Process 2025</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 border">
              <p className="text-gray-700 leading-relaxed mb-4">
                Most colleges in India conduct admissions through entrance examinations such as JEE Main, NEET, CAT, 
                GATE, and CLAT. Additionally, some institutions offer direct admission based on merit in qualifying 
                examinations like Class 12th boards.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {['JEE Main', 'NEET', 'CAT', 'CLAT', 'GATE', 'CMAT', 'XAT', 'MAT'].map((exam) => (
                  <div key={exam} className="bg-white rounded-lg px-4 py-3 text-center font-semibold text-gray-700 shadow-sm">
                    {exam}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* COLLEGE LISTING SECTION WITH FILTERS */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse All Colleges</h2>
          
          <div className="flex gap-6">
            {/* LEFT SIDEBAR - FILTERS */}
            <aside className={`w-80 flex-shrink-0 transition-all ${showFilters ? '' : 'hidden'}`}>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FiFilter className="text-orange-600" /> Filters
                  </h3>
                  <button 
                    onClick={() => setFilters({ city: '', state: '', type: [], minFees: '', maxFees: '', course: '' })}
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
                    <select
                      value={filters.state}
                      onChange={(e) => setFilters({...filters, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({...filters, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select City</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>

                  {/* Course */}
                  <div>
                    <label className="font-semibold text-sm mb-3 block text-gray-700">Course</label>
                    <select
                      value={filters.course}
                      onChange={(e) => setFilters({...filters, course: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      <option value="">All Courses</option>
                      <option value="btech">B.Tech</option>
                      <option value="mbbs">MBBS</option>
                      <option value="mba">MBA</option>
                      <option value="bcom">B.Com</option>
                      <option value="bsc">B.Sc</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                      />
                      <input 
                        type="number"
                        placeholder="Max Fees"
                        value={filters.maxFees}
                        onChange={(e) => setFilters({...filters, maxFees: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
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

            {/* MAIN CONTENT - COLLEGE LISTING */}
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
                    {loading ? 'Loading...' : `${colleges.length} Colleges Found`}
                  </h3>
                </div>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm">
                  <option>Sort by: Ranking</option>
                  <option>Fees: Low to High</option>
                  <option>Fees: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>

              {/* College Cards */}
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
              ) : colleges.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center shadow-md">
                  <p className="text-gray-600 text-lg">No colleges found. Try adjusting your filters.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedColleges.map((college, index) => (
                      <div key={college.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border">
                        <div className="p-6">
                          <div className="flex gap-6">
                            {/* Rank & Logo */}
                            <div className="flex flex-col items-center">
                              <div className="text-2xl font-bold text-gray-400 mb-2">#{index + 1}</div>
                              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                                {college.images?.[0] ? (
                                  <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">{college.name.charAt(0)}</span>
                                )}
                              </div>
                            </div>

                            {/* College Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Link to={`/colleges/${college.id}`} className="text-xl font-bold text-blue-600 hover:underline">
                                      {college.name}
                                    </Link>
                                    {college.featured && (
                                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-semibold">Featured</span>
                                    )}
                                    {college.verified && <FiCheckCircle className="text-green-600" />}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                    <FiMapPin className="text-orange-600" />
                                    <span>{college.location?.city}, {college.location?.state}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="font-medium text-blue-600">{college.type}</span>
                                  </div>
                                  <div className="text-sm text-gray-600">{college.accreditation || 'NAAC A+'}</div>
                                </div>
                                {college.rating && (
                                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold">
                                    <FiStar className="fill-current" />
                                    {college.rating}/5
                                  </div>
                                )}
                              </div>

                              {/* Metrics Grid */}
                              <div className="grid grid-cols-3 gap-6 py-4 border-t border-b border-gray-200 mb-4">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Course Fees</div>
                                  <div className="text-lg font-bold text-gray-900">₹{(college.average_fees / 100000).toFixed(2)}L</div>
                                  <div className="text-xs text-gray-500">1st Year</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Average Package</div>
                                  <div className="text-lg font-bold text-green-600">
                                    ₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : 'N/A'}L
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Highest: ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : 'N/A'}L
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Ranking</div>
                                  <div className="flex items-center gap-1 text-orange-600 font-bold">
                                    <FiAward />
                                    <span>#{index + 1}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">India 2025</div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-3">
                                <Link to={`/colleges/${college.id}`}>
                                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
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
                          className={page === i + 1 ? 'bg-orange-600 hover:bg-orange-700' : ''}
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

export default CollegeListingPage;
