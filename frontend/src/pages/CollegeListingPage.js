import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCheckCircle, FiAward, FiEdit3, FiGrid, FiTarget, FiFilter, FiChevronDown, FiUser, FiSearch, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
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
  });

  useEffect(() => {
    fetchColleges();
  }, [searchParams, sortBy]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/colleges?${searchParams.toString()}&sort=${sortBy}`);
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

  const toggleCompare = (collegeId) => {
    setCompareList(prev => 
      prev.includes(collegeId) 
        ? prev.filter(id => id !== collegeId)
        : prev.length < 4 ? [...prev, collegeId] : prev
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
    });
    setSearchParams(new URLSearchParams());
  };

  const paginatedColleges = colleges.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(colleges.length / itemsPerPage);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* PAGE HEADING */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Top Colleges in India 2025</h1>
          <div className="text-gray-700 text-base leading-relaxed mb-6">
            <p className="mb-4">
              India has over <strong>4359 colleges</strong>, including <strong>3623 private colleges</strong> and <strong>676 government colleges</strong>. 
              Admissions in India are done mainly through <strong>JEE Main</strong>. Direct admission in colleges in India depends on merit based on 12th-class marks. 
              The fees of the colleges vary from <strong>₹4,400 at AU Allahabad</strong> to <strong>₹37.8 Lakh at ICAS Manipal</strong>, 
              while the Median Package ranges from ₹17 LPA at IIT Roorkee to ₹21.60 LPA at IIT Guwahati.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Some of the top colleges in India are <strong>IIT Bombay, IIT Delhi, IIT Madras, IIT Kanpur and IIT Kharagpur</strong>.</li>
              <li><strong>IIT Bombay</strong> is the best college in India, as per the Collegedunia and IIRF rankings.</li>
              <li><strong>IIT BHU has the best ROI of 239.52%</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ADVERTISEMENT BANNERS */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/write-review" className="block">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center text-center">
                <FiEdit3 className="text-4xl mb-3" />
                <h3 className="font-bold text-xl mb-2">Write a Review</h3>
                <p className="text-sm">Get Upto ₹300*</p>
              </div>
            </Link>
            <Link to="/course-finder" className="block">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center text-center">
                <FiGrid className="text-4xl mb-3" />
                <h3 className="font-bold text-xl mb-2">Course Finder</h3>
                <p className="text-sm">Find Your Perfect Course</p>
              </div>
            </Link>
            <Link to="/college-predictor" className="block">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow h-full flex flex-col justify-center items-center text-center">
                <FiTarget className="text-4xl mb-3" />
                <h3 className="font-bold text-xl mb-2">College Predictor</h3>
                <p className="text-sm">Know Your Admission Chances</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* AUTHOR INFO */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                <FiUser size={20} />
              </div>
            </div>
            <div>
              <Link to="/author/content-team" className="font-semibold text-gray-900 hover:text-orange-600">Content Team</Link>
              <p className="text-xs text-gray-600">Content Curator | Updated 3+ months ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE OF CONTENTS */}
      <div className="bg-white py-6 border-b">
        <div className="container mx-auto px-6">
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
                { num: '07', title: 'Top-Ranked Colleges by Agencies', id: 'agencies' },
                { num: '08', title: 'Top-Ranked Colleges by NIRF', id: 'nirf' },
                { num: '09', title: 'Admission 2025', id: 'admission' },
                { num: '10', title: 'Top Specialisations', id: 'specialisations' },
                { num: '11', title: 'Top States', id: 'states' },
                { num: '12', title: 'Top Cities', id: 'cities' },
                { num: '13', title: 'Entrance Exams', id: 'exams' },
                { num: '14', title: 'FAQs', id: 'faqs' },
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
        </div>
      </div>

      {/* ALL CONTENT SECTIONS */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-6">
          {/* Read More Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowContent(!showContent)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              {showContent ? (
                <>
                  <span>Read Less</span>
                  <FiChevronDown className="transform rotate-180 transition-transform" />
                </>
              ) : (
                <>
                  <span>Read More</span>
                  <FiChevronDown className="transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Collapsible Content */}
          {showContent && (
          <div className="space-y-12">
          
          {/* HIGHLIGHTS TABLE */}
          <section id="highlights">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Colleges in India Highlights</h2>
            <p className="text-gray-700 mb-6">Provided below are the highlights of colleges in India:</p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-b">Details</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700 border-b">Statistics</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Number of Colleges in India', value: '4,359' },
                    { label: 'Number of Govt Colleges in India', value: '676' },
                    { label: 'Number of Private Colleges in India', value: '3,623' },
                    { label: 'Top College', value: <Link to="/colleges/iit-bombay" className="text-blue-600 hover:underline">IIT Bombay</Link> },
                    { label: 'Top Specialisations', value: 'Computer Science, Mechanical, Information Technology, Civil, Electronics & Communication' },
                    { label: 'Total Fees Range', value: '₹4,400 (AU Allahabad) - ₹37.8 Lakh (ICAS Manipal)' },
                    { label: 'Median Package', value: '₹14.35 LPA (NIT Trichy) - ₹21.60 LPA (IIT Guwahati)' },
                    { label: 'Accepted Entrance Exam', value: 'JEE Main, TNEA, MHT CET, UPTAC, Maharashtra JEE Main' },
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-semibold text-gray-900 border-b">{row.label}</td>
                      <td className="px-6 py-4 text-gray-700 border-b">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TOP COLLEGES TABLE */}
          <section id="top-colleges">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Colleges in India 2025</h2>
            <p className="text-gray-700 mb-6">
              There are 676 government and 3623 private colleges in India, totaling 4359 institutions. 
              The total number of seats varies from 595 at IIT Hyderabad to 1563 at IIT BHU, while the fees range from 
              ₹8.35 Lakh at IIT BHU to ₹23.9 Lakh at BITS Pilani. The rankings, total seats, and total course fees of 
              India's top ten colleges are listed below.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-x-auto border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Colleges</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Seats</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Total Course Fees</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Median Placement</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 border-b">Top Recruiters</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'IIT Bombay', seats: '1241', fees: '₹8.75 Lakh', placement: '₹19.61 LPA', recruiters: 'Google, Microsoft, Apple, Goldman Sachs, McKinsey, BCG' },
                    { name: 'IIT Delhi', seats: '1229', fees: '₹8.66 Lakh', placement: '₹19.08 LPA', recruiters: 'Google, Uber, Microsoft, Goldman Sachs, WorldQuant, Amazon' },
                    { name: 'IIT Madras', seats: '1054', fees: '₹9.39 Lakh', placement: '₹17.50 LPA', recruiters: 'Oracle, Qualcomm, Apple, JP Morgan, Texas Instruments' },
                    { name: 'IIT Kanpur', seats: '1210', fees: '₹8.6 Lakh', placement: '₹19.40 LPA', recruiters: 'Google, Microsoft, Oracle, Qualcomm, American Express' },
                    { name: 'IIT Kharagpur', seats: '1550', fees: '₹10.29 Lakh', placement: '₹19.76 LPA', recruiters: 'Google, Barclays, EXL, Schlumberger, ITC, Adobe' },
                    { name: 'IIT Roorkee', seats: '1323', fees: '₹8.87 Lakh', placement: '₹17.00 LPA', recruiters: 'Apple, Google, Flipkart, Bajaj Auto, Uber, Atlassian' },
                    { name: 'IIT Guwahati', seats: '1008', fees: '₹9.04 Lakh', placement: '₹21.60 LPA', recruiters: 'Adobe, ThoughtSpot, Qualcomm, Goldman Sachs, Uber' },
                    { name: 'BITS Pilani', seats: '-', fees: '₹23.9 Lakh', placement: '₹18.20 LPA', recruiters: 'Google, DE Shaw, Qualcomm, Adobe, Microsoft' },
                    { name: 'IIT BHU, Varanasi', seats: '1563', fees: '₹8.35 Lakh', placement: '₹20.00 LPA', recruiters: 'Oracle, Google, Flipkart, Sprinklr, Texas Instruments' },
                    { name: 'IIT Hyderabad', seats: '595', fees: '₹9.17 Lakh', placement: '₹21.00 LPA', recruiters: 'Microsoft, Nvidia, Qualcomm, TSMC, Amazon, Adobe' },
                  ].map((college, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/colleges/${idx + 1}`} className="text-blue-600 hover:underline font-medium">{college.name}</Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{college.seats}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{college.fees}</td>
                      <td className="px-4 py-3 font-semibold text-green-600">{college.placement}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{college.recruiters}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Additional sections placeholders */}
          <section id="govt-colleges">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Govt Colleges in India 2025</h2>
            <p className="text-gray-700 mb-4">
              IIT Bombay, IIT Delhi, and IIT Madras are among the <strong>676 government universities</strong> in India 
              that offer programs. This list includes the highest package, median placement, average placement, and total 
              course fees for Government colleges in India.
            </p>
          </section>

          <section id="private-colleges">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Private Colleges in India 2025</h2>
            <p className="text-gray-700 mb-4">
              There are 4626 private colleges in India, of which 3623 offer programs. The median package ranges from 
              ₹8.99 LPA at VIT Vellore to ₹29.37 LPA at IIIT Bangalore.
            </p>
          </section>

          <section id="admission">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Colleges in India: Admission 2025</h2>
            <p className="text-gray-700 mb-4">
              Colleges in India offer admission mainly through entrance exams like JEE Main. Some colleges also provide 
              direct admission based on merit or college entrance tests. Apart from this, most colleges require a minimum 
              of 45% in Class 12th.
            </p>
          </section>

          <section id="faqs">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Colleges in India FAQs</h2>
            <div className="space-y-4">
              {[
                { q: 'How many colleges are there in India?', a: 'There are approximately 4,359 colleges in India, including 676 government and 3,623 private colleges.' },
                { q: 'What is the top college in India?', a: 'IIT Bombay is ranked as the top college in India as per various rankings including Collegedunia 2025.' },
                { q: 'What is the fee range for colleges in India?', a: 'The fee range varies from ₹10,000 per year in some government colleges to ₹40 Lakh in top private institutions.' },
              ].map((faq, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-6 border">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
          </div>
          )}
        </div>
      </div>

      {/* COLLEGE LISTING SECTION */}
      <div className="bg-gray-50 py-12 border-t-4 border-orange-600">
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
                      <option value="jee-main">JEE Main (1730)</option>
                      <option value="neet">NEET (612)</option>
                      <option value="cat">CAT (876)</option>
                      <option value="gate">GATE (545)</option>
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
                    {loading ? 'Loading...' : `${colleges.length} Colleges Found`}
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
                  <p className="text-gray-600">Loading colleges...</p>
                </div>
              ) : colleges.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <FiSearch className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600 text-lg mb-2">No colleges found</p>
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
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-24">CD Rank</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800">Colleges</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-32">Course Fees</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-40">Placement</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-32">User Reviews</th>
                          <th className="px-4 py-4 text-left text-sm font-bold text-gray-800 w-32">Ranking</th>
                        </tr>
                      </thead>
                      
                      {/* TABLE BODY */}
                      <tbody>
                        {paginatedColleges.map((college, index) => {
                          const globalIndex = (currentPage - 1) * itemsPerPage + index;
                          const isInCompare = compareList.includes(college.id);
                          
                          return (
                            <React.Fragment key={college.id}>
                              <tr className="border-b border-gray-200 hover:bg-orange-50 transition-colors">
                                {/* CD RANK */}
                                <td className="px-3 py-4 align-top">
                                  <div className="flex flex-col items-center">
                                    <div className="text-2xl font-bold text-gray-400">#{globalIndex + 1}</div>
                                  </div>
                                </td>

                                {/* COLLEGES */}
                                <td className="px-3 py-4 align-top">
                                  <div className="max-w-md">
                                    <div className="flex items-start gap-2 mb-1.5">
                                      {/* College Logo */}
                                      <div className="w-11 h-11 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                                        {college.images?.[0] ? (
                                          <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                            {college.name.charAt(0)}
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-start gap-2 mb-1">
                                          <Link to={`/colleges/${college.id}`} className="text-sm font-bold text-blue-600 hover:underline leading-tight">
                                            {college.name}
                                          </Link>
                                          {college.featured && (
                                            <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">Featured</span>
                                          )}
                                        </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-600 mb-1">
                                      <FiMapPin className="text-orange-600 flex-shrink-0" size={11} />
                                      <span>{college.location?.city}, {college.location?.state}</span>
                                      <span className="text-gray-400">|</span>
                                      <span className="text-blue-600 font-medium">{college.type}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-600 mb-2">{college.accreditation || 'NAAC A+'} Approved</div>
                                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                                      <Link to={`/colleges/${college.id}`}>
                                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] h-7 px-2.5">
                                          Apply Now
                                        </Button>
                                      </Link>
                                      <Button size="sm" variant="outline" className="text-[11px] h-7 px-2.5 border-gray-300">
                                        Download Brochure
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className={`text-[11px] h-7 px-2.5 ${isInCompare ? 'bg-orange-100 text-orange-700' : 'text-gray-600'}`}
                                        onClick={() => toggleCompare(college.id)}
                                      >
                                        {isInCompare ? <FiCheckCircle className="mr-1" size={11} /> : null}
                                        {isInCompare ? 'Added' : 'Add To Compare'}
                                      </Button>
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">
                                      <span className="font-semibold">CD Score:</span> {Math.floor(Math.random() * 500) + 1000}/2000
                                    </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* COURSE FEES */}
                                <td className="px-3 py-4 align-top">
                                  <div>
                                    <div className="text-base font-bold text-gray-900 mb-0.5">
                                      ₹{(college.average_fees / 100000).toFixed(2)}L
                                    </div>
                                    <div className="text-[10px] text-gray-500 mb-1.5">1st Year Fees</div>
                                    <Link to={`/colleges/${college.id}#fees`} className="text-[11px] text-blue-600 hover:underline">
                                      Compare Fees
                                    </Link>
                                  </div>
                                </td>

                                {/* PLACEMENT */}
                                <td className="px-3 py-4 align-top">
                                  <div>
                                    <div className="text-[10px] text-gray-500 mb-0.5">Average Package</div>
                                    <div className="text-sm font-bold text-green-600 mb-2">
                                      ₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : 'N/A'}L
                                    </div>
                                    <div className="text-[10px] text-gray-500 mb-0.5">Highest Package</div>
                                    <div className="text-sm font-bold text-gray-900 mb-1.5">
                                      ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : 'N/A'}L
                                    </div>
                                    <Link to={`/colleges/${college.id}#placement`} className="text-[11px] text-blue-600 hover:underline">
                                      Compare Placement
                                    </Link>
                                  </div>
                                </td>

                                {/* USER REVIEWS */}
                                <td className="px-3 py-4 align-top">
                                  <div>
                                    <div className="flex items-baseline gap-0.5 mb-0.5">
                                      <span className="text-lg font-bold text-gray-900">{college.rating || '4.5'}</span>
                                      <span className="text-gray-500 text-xs">/5</span>
                                    </div>
                                    <div className="flex gap-0.5 mb-1.5">
                                      {[...Array(5)].map((_, i) => (
                                        <FiStar 
                                          key={i} 
                                          className={`${i < Math.floor(college.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                          size={11} 
                                        />
                                      ))}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mb-1.5">
                                      Based on {college.reviews || Math.floor(Math.random() * 500) + 50} User<br />Reviews
                                    </div>
                                    <div className="text-[10px] text-gray-700 font-medium">
                                      Best in {['Infrastructure', 'Placements', 'Academics', 'Faculty', 'Campus Life'][index % 5]}
                                    </div>
                                  </div>
                                </td>

                                {/* RANKING */}
                                <td className="px-3 py-4 align-top">
                                  <div>
                                    <div className="text-[11px] text-gray-600 mb-1.5">
                                      #{globalIndex + 1}th/500 in India
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                      <FiAward className="text-orange-600 flex-shrink-0" size={12} />
                                      <span className="text-[10px] font-bold text-gray-700">Collegedunia</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-1.5">
                                      {['NIRF', 'IIRF', 'IT'].map((agency) => (
                                        <div key={agency} className="w-5 h-5 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                                          <span className="text-[8px] font-bold text-gray-700">{agency.slice(0, 2)}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <Link to={`/colleges/${college.id}#ranking`} className="text-[11px] text-blue-600 hover:underline">
                                      + 4 More
                                    </Link>
                                  </div>
                                </td>
                              </tr>

                              {/* FEATURED BANNER */}
                              {(index + 1) % 3 === 0 && (index + 1) < paginatedColleges.length && (
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

      {/* NEWSLETTER SUBSCRIPTION */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Subscribe to Our Newsletter</h3>
          <p className="text-white mb-6">Get the latest updates on college admissions, exams, and education news</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeListingPage;
