import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCheckCircle, FiAward, FiEdit3, FiGrid, FiTarget, FiFilter, FiChevronDown, FiUser } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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

  const paginatedColleges = colleges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(colleges.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* PAGE HEADING */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Top Colleges in India 2025</h1>
          <p className="text-gray-700 text-base leading-relaxed mb-6">
            India has over 4359 colleges, including 3623 private colleges and 676 government colleges. 
            Admissions in India are done mainly through entrance exams like JEE Main, NEET, CAT. 
            The fees vary from <strong>₹10,000 at government colleges</strong> to <strong>₹40 Lakh at top private institutions</strong>, 
            while the Median Package ranges from ₹3 LPA to ₹25 LPA.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Some of the top colleges in India are <strong>IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur and IIT Kharagpur</strong>.</li>
            <li><strong>IIT Bombay</strong> is the best college in India, as per the Collegedunia rankings.</li>
          </ul>
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

      {/* AUTHOR INFO */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
              <FiUser size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Content Team</p>
              <p className="text-xs text-gray-600">Content Curator | Updated 3+ months ago</p>
            </div>
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
          {showContent && (
          <div className="space-y-12">
          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a href="#highlights" className="text-sm text-blue-600 hover:underline">01. Colleges in India Highlights</a>
              <a href="#top-colleges" className="text-sm text-blue-600 hover:underline">02. Top Colleges in India 2025</a>
              <a href="#govt-colleges" className="text-sm text-blue-600 hover:underline">03. Govt Colleges in India 2025</a>
              <a href="#private-colleges" className="text-sm text-blue-600 hover:underline">04. Private Colleges in India 2025</a>
              <a href="#admission" className="text-sm text-blue-600 hover:underline">05. Colleges in India: Admission 2025</a>
              <a href="#faqs" className="text-sm text-blue-600 hover:underline">06. Colleges in India FAQs</a>
            </div>
          </div>

          {/* Highlights Table */}
          <div id="highlights">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Colleges in India Highlights</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50 w-1/2">Number of Colleges in India</td>
                    <td className="px-6 py-4">4,359</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Number of Govt Colleges in India</td>
                    <td className="px-6 py-4">676</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Number of Private Colleges in India</td>
                    <td className="px-6 py-4">3,623</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Top College</td>
                    <td className="px-6 py-4">
                      <Link to="/colleges/iit-bombay" className="text-blue-600 hover:underline font-medium">IIT Bombay</Link>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold bg-gray-50">Total Fees Range</td>
                    <td className="px-6 py-4">₹10,000 - ₹40,00,000 per year</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold bg-gray-50">Median Package</td>
                    <td className="px-6 py-4">₹3 LPA - ₹25 LPA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 10 Colleges Table */}
          <div id="top-colleges">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Colleges in India 2025</h2>
            <p className="text-gray-700 mb-6">
              There are 676 government and 3623 private colleges in India, totaling 4359 institutions. 
              The rankings, total seats, and total course fees of India's top ten colleges are listed below.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Colleges</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Course Fees</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Median Placement</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Top Recruiters</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'IIT Bombay', fees: '8.75L', placement: '19.61 LPA', recruiters: 'Google, Microsoft, Apple, Goldman Sachs' },
                    { name: 'IIT Delhi', fees: '8.66L', placement: '19.08 LPA', recruiters: 'Google, Uber, Microsoft, Goldman Sachs' },
                    { name: 'IIT Madras', fees: '9.39L', placement: '17.50 LPA', recruiters: 'Oracle, Qualcomm, Apple, JP Morgan' },
                    { name: 'IIT Kanpur', fees: '8.6L', placement: '19.40 LPA', recruiters: 'Google, Microsoft, Oracle, Qualcomm' },
                    { name: 'IIT Kharagpur', fees: '10.29L', placement: '19.76 LPA', recruiters: 'Google, Barclays, EXL, Schlumberger' },
                    { name: 'BITS Pilani', fees: '23.9L', placement: '18.20 LPA', recruiters: 'Google, DE Shaw, Qualcomm, Adobe' },
                  ].map((college, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/colleges/${idx + 1}`} className="text-blue-600 hover:underline font-medium">{college.name}</Link>
                      </td>
                      <td className="px-4 py-3 font-semibold">₹{college.fees}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">₹{college.placement}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{college.recruiters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Other sections */}
          <div id="govt-colleges">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Govt Colleges in India 2025</h2>
            <p className="text-gray-700">There are 676 government colleges in India offering quality education at affordable fees.</p>
          </div>

          <div id="private-colleges">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Private Colleges in India 2025</h2>
            <p className="text-gray-700">There are 3623 private colleges in India with various specializations.</p>
          </div>

          <div id="admission">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Colleges in India: Admission 2025</h2>
            <p className="text-gray-700">Admissions are mainly through entrance exams like JEE Main, NEET, CAT, etc.</p>
          </div>

          <div id="faqs">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Colleges in India FAQs</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <h3 className="font-bold mb-2">How many colleges are there in India?</h3>
                <p className="text-gray-700">There are approximately 4,359 colleges in India.</p>
              </div>
            </div>
          </div>
          </div>
          )}
        </div>
      </div>

      {/* COLLEGE LISTING SECTION WITH FILTERS */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({...filters, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="">Select City</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Bangalore">Bangalore</option>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                      <input 
                        type="number"
                        placeholder="Max Fees"
                        value={filters.maxFees}
                        onChange={(e) => setFilters({...filters, maxFees: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
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

            {/* MAIN CONTENT - COLLEGE TABLE */}
            <main className="flex-1">
              {/* Top Bar */}
              <div className="mb-6 flex justify-between items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm shadow-sm"
                >
                  <FiFilter />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                <h3 className="text-lg font-semibold text-gray-800">
                  {loading ? 'Loading...' : `${colleges.length} Colleges Found`}
                </h3>
              </div>

              {/* COLLEGE TABLE */}
              {loading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">Loading colleges...</p>
                </div>
              ) : colleges.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <p className="text-gray-600 text-lg">No colleges found. Try adjusting your filters.</p>
                </div>
              ) : (
                <>
                  {/* TABLE WITH HEADERS */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden border">
                    <table className="w-full">
                      {/* TABLE HEADER */}
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">CD Rank</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Colleges</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Course Fees</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Placement</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">User Reviews</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-700">Ranking</th>
                        </tr>
                      </thead>
                      
                      {/* TABLE BODY */}
                      <tbody>
                        {paginatedColleges.map((college, index) => (
                          <React.Fragment key={college.id}>
                            <tr className="border-b hover:bg-gray-50">
                              {/* CD RANK COLUMN */}
                              <td className="px-4 py-6 align-top">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="text-3xl font-bold text-gray-400">#{(currentPage - 1) * itemsPerPage + index + 1}</div>
                                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded flex items-center justify-center overflow-hidden">
                                    {college.images?.[0] ? (
                                      <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <span className="text-white font-bold text-lg">{college.name.charAt(0)}</span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* COLLEGES COLUMN */}
                              <td className="px-4 py-6 align-top">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Link to={`/colleges/${college.id}`} className="text-lg font-bold text-blue-600 hover:underline">
                                      {college.name}
                                    </Link>
                                    {college.featured && (
                                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-semibold">Featured</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <FiMapPin className="text-orange-600" />
                                    <span>{college.location?.city}, {college.location?.state}</span>
                                    <span className="text-gray-400">|</span>
                                    <span>{college.accreditation || 'NAAC A+'}</span>
                                  </div>
                                  <div className="flex gap-2 mb-2">
                                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-xs">
                                      Apply Now
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs">Download Brochure</Button>
                                    <Button size="sm" variant="ghost" className="text-xs">Add To Compare</Button>
                                  </div>
                                  <div className="text-xs text-gray-500">CD Score: {Math.floor(Math.random() * 500) + 1000}/2000</div>
                                </div>
                              </td>

                              {/* COURSE FEES COLUMN */}
                              <td className="px-4 py-6 align-top">
                                <div>
                                  <div className="text-xl font-bold text-gray-900 mb-1">₹{(college.average_fees / 100000).toFixed(2)}L</div>
                                  <div className="text-xs text-gray-500 mb-2">1st Year Fees</div>
                                  <Link to={`/colleges/${college.id}#fees`} className="text-xs text-blue-600 hover:underline">
                                    Compare Fees
                                  </Link>
                                </div>
                              </td>

                              {/* PLACEMENT COLUMN */}
                              <td className="px-4 py-6 align-top">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Average Package</div>
                                  <div className="text-lg font-bold text-green-600 mb-3">
                                    ₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : 'N/A'}L
                                  </div>
                                  <div className="text-xs text-gray-500 mb-1">Highest Package</div>
                                  <div className="text-lg font-bold text-gray-900 mb-2">
                                    ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : 'N/A'}L
                                  </div>
                                  <Link to={`/colleges/${college.id}#placement`} className="text-xs text-blue-600 hover:underline">
                                    Compare Placement
                                  </Link>
                                </div>
                              </td>

                              {/* USER REVIEWS COLUMN */}
                              <td className="px-4 py-6 align-top">
                                <div>
                                  <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-2xl font-bold text-gray-900">{college.rating || '4.5'}</span>
                                    <span className="text-gray-500 text-sm">/5</span>
                                  </div>
                                  <div className="flex gap-0.5 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                      <FiStar key={i} className={`${i < Math.floor(college.rating || 4.5) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} size={14} />
                                    ))}
                                  </div>
                                  <div className="text-xs text-gray-500 mb-2">Based on {college.reviews || 0} User Reviews</div>
                                  <div className="text-xs text-gray-700 font-medium">Best in {['Infrastructure', 'Placements', 'Academics'][index % 3]}</div>
                                </div>
                              </td>

                              {/* RANKING COLUMN */}
                              <td className="px-4 py-6 align-top">
                                <div>
                                  <div className="text-sm text-gray-600 mb-2">#{(currentPage - 1) * itemsPerPage + index + 1}th/500 in India</div>
                                  <div className="flex items-center gap-1 mb-3">
                                    <FiAward className="text-orange-600" size={16} />
                                    <span className="text-xs font-semibold text-gray-700">Collegedunia 2025</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {['NIRF', 'IIRF', 'India Today'].slice(0, 2).map((agency) => (
                                      <div key={agency} className="w-5 h-5 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                        <span className="text-[8px] font-bold text-gray-600">{agency.charAt(0)}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <Link to={`/colleges/${college.id}#ranking`} className="text-xs text-blue-600 hover:underline">
                                    + 4 More
                                  </Link>
                                </div>
                              </td>
                            </tr>

                            {/* FEATURED BANNER - Show after every 3rd college */}
                            {(index + 1) % 3 === 0 && (index + 1) < paginatedColleges.length && (
                              <tr className="bg-orange-50 border-b border-orange-200">
                                <td colSpan="6" className="px-4 py-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-orange-700">Sponsored</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-600">Featured College</span>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                            onClick={() => setCurrentPage(pageNum)}
                            className={`text-sm min-w-[40px] ${currentPage === pageNum ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      
                      {totalPages > 10 && (
                        <>
                          <span className="text-gray-500">...</span>
                          <Button
                            variant={currentPage === totalPages ? 'default' : 'outline'}
                            onClick={() => setCurrentPage(totalPages)}
                            className={`text-sm min-w-[40px] ${currentPage === totalPages ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}`}
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
    </div>
  );
};

export default CollegeListingPage;
