import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMapPin, FiStar, FiCheckCircle, FiAward, FiEdit3, FiGrid, FiTarget } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const CollegeListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Top Colleges in India 2025</h1>
          <p className="text-gray-600 text-lg mb-6">
            India has over 4000+ colleges. Explore the top colleges with rankings, fees, placements, and admission details. 
            The fees vary from ₹10,000 to ₹40 Lakh, while median packages range from ₹3 LPA to ₹25 LPA.
          </p>
          
          {/* Advertisement Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Link to="/colleges" className="block">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiEdit3 className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">Write a Review</h3>
                <p className="text-sm">Get Upto ₹300*</p>
              </div>
            </Link>
            <Link to="/courses" className="block">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiGrid className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">Course Finder</h3>
                <p className="text-sm">Find Your Perfect Course</p>
              </div>
            </Link>
            <Link to="/eligibility-checker" className="block">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white hover:shadow-lg transition-shadow">
                <FiTarget className="text-3xl mb-2" />
                <h3 className="font-bold text-lg mb-1">College Predictor</h3>
                <p className="text-sm">Know Your Admission Chances</p>
              </div>
            </Link>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button onClick={() => scrollToSection('highlights')} className="text-left text-sm text-blue-600 hover:underline">
                01. Colleges Highlights
              </button>
              <button onClick={() => scrollToSection('top-colleges')} className="text-left text-sm text-blue-600 hover:underline">
                02. Top Colleges 2025
              </button>
              <button onClick={() => scrollToSection('govt-colleges')} className="text-left text-sm text-blue-600 hover:underline">
                03. Government Colleges
              </button>
              <button onClick={() => scrollToSection('private-colleges')} className="text-left text-sm text-blue-600 hover:underline">
                04. Private Colleges
              </button>
              <button onClick={() => scrollToSection('admission')} className="text-left text-sm text-blue-600 hover:underline">
                05. Admission 2025
              </button>
              <button onClick={() => scrollToSection('faqs')} className="text-left text-sm text-blue-600 hover:underline">
                06. FAQs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Colleges Highlights */}
        <section id="highlights" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Colleges in India Highlights</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="px-6 py-4 font-semibold bg-gray-50">Number of Colleges in India</td>
                  <td className="px-6 py-4">4359</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-semibold bg-gray-50">Number of Government Colleges</td>
                  <td className="px-6 py-4">676</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-semibold bg-gray-50">Number of Private Colleges</td>
                  <td className="px-6 py-4">3623</td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-semibold bg-gray-50">Top College</td>
                  <td className="px-6 py-4">
                    <Link to="/colleges/iit-bombay-001" className="text-blue-600 hover:underline">IIT Bombay</Link>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 font-semibold bg-gray-50">Total Fees Range</td>
                  <td className="px-6 py-4">₹10,000 - ₹40 Lakh</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold bg-gray-50">Median Package Range</td>
                  <td className="px-6 py-4">₹3 LPA - ₹25 LPA</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Top Colleges 2025 */}
        <section id="top-colleges" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Colleges in India 2025</h2>
          <p className="text-gray-600 mb-6">
            There are 676 government and 3623 private colleges in India. Below is the comprehensive list of top colleges 
            with detailed information on rankings, fees, placements, and more.
          </p>

          {/* College Cards with Table Layout */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {colleges.map((college, index) => (
                <div key={college.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200">
                  {/* Table Header Row */}
                  {index === 0 && (
                    <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 border-b font-semibold text-sm text-gray-700">
                      <div>CD Rank</div>
                      <div className="col-span-2">Colleges</div>
                      <div>Course Fees</div>
                      <div>Placement</div>
                      <div>User Reviews</div>
                      <div>Ranking</div>
                    </div>
                  )}

                  {/* College Row */}
                  <div className="grid grid-cols-6 gap-4 px-6 py-6 items-start">
                    {/* CD Rank */}
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-gray-400 mb-2">#{index + 1}</div>
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold overflow-hidden">
                        {college.images?.[0] ? (
                          <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{college.name.charAt(0)}</span>
                        )}
                      </div>
                    </div>

                    {/* College Info */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Link to={`/colleges/${college.id}`} className="text-lg font-bold text-blue-600 hover:underline">
                          {college.name}
                        </Link>
                        {college.featured && (
                          <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded">Featured</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <FiMapPin className="text-orange-600" />
                        <span>{college.location?.city}, {college.location?.state}</span>
                        <span className="text-gray-400">|</span>
                        <span>{college.type}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {college.accreditation || 'NAAC A+'}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Link to={`/colleges/${college.id}`}>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                            Apply Now
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">Download Brochure</Button>
                        <Button size="sm" variant="ghost">Add To Compare</Button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        CD Score: {Math.floor(Math.random() * 500) + 1000}/2000
                      </div>
                    </div>

                    {/* Course Fees */}
                    <div>
                      <div className="text-xl font-bold text-gray-900 mb-1">
                        ₹{(college.average_fees / 100000).toFixed(2)}L
                      </div>
                      <div className="text-xs text-gray-500">1st Year Fees</div>
                      <Link to={`/colleges/${college.id}#fees`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                        Compare Fees
                      </Link>
                    </div>

                    {/* Placement */}
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Average Package</div>
                      <div className="text-lg font-bold text-green-600 mb-2">
                        ₹{college.placement?.average ? (college.placement.average / 100000).toFixed(1) : 'N/A'}L
                      </div>
                      <div className="text-sm text-gray-500 mb-1">Highest Package</div>
                      <div className="text-lg font-bold text-gray-900">
                        ₹{college.placement?.highest ? (college.placement.highest / 100000).toFixed(1) : 'N/A'}L
                      </div>
                      <Link to={`/colleges/${college.id}#placement`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                        Compare Placement
                      </Link>
                    </div>

                    {/* User Reviews */}
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-2xl font-bold text-gray-900">{college.rating || '4.5'}</span>
                        <span className="text-gray-500">/5</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className={i < Math.floor(college.rating || 4.5) ? 'fill-current' : ''} size={16} />
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">Based on {college.reviews || 0} User Reviews</div>
                      <div className="text-xs text-gray-600">Best in {['Infrastructure', 'Placements', 'Academics'][index % 3]}</div>
                    </div>

                    {/* Ranking */}
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        #{index + 1}th/500 in India
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <FiAward className="text-orange-600" />
                        <span className="text-xs font-semibold">Collegedunia 2025</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['NIRF', 'IIRF', 'IndiaToday'].slice(0, 2).map((agency) => (
                          <div key={agency} className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
                            {agency}
                          </div>
                        ))}
                      </div>
                      <Link to={`/colleges/${college.id}#ranking`} className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                        + 4 More
                      </Link>
                    </div>
                  </div>

                  {/* Featured College Banner - Show after every 3rd college */}
                  {index > 0 && (index + 1) % 3 === 0 && (
                    <div className="border-t border-orange-200 bg-orange-50 px-6 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-orange-700">Sponsored</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="text-sm text-gray-600">Featured College</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Government Colleges Section */}
        <section id="govt-colleges" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Government Colleges in India 2025</h2>
          <p className="text-gray-600 mb-6">
            There are 676 government colleges in India offering quality education at affordable fees.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-700">View all government colleges by applying filters above</p>
          </div>
        </section>

        {/* Private Colleges Section */}
        <section id="private-colleges" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Private Colleges in India 2025</h2>
          <p className="text-gray-600 mb-6">
            There are 3623 private colleges in India with various specializations and placements.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <p className="text-gray-700">View all private colleges by applying filters above</p>
          </div>
        </section>

        {/* Admission 2025 */}
        <section id="admission" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Admission 2025</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 mb-4">
              Colleges in India offer admission mainly through entrance exams like JEE Main, NEET, CAT, etc. 
              Some colleges also provide direct admission based on merit.
            </p>
            <Link to="/exams">
              <Button className="bg-orange-600 hover:bg-orange-700">View All Entrance Exams</Button>
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Colleges in India FAQs</h2>
          <div className="space-y-4">
            {[
              {
                q: "How many colleges are there in India?",
                a: "There are approximately 4359 colleges in India, including 676 government and 3623 private colleges."
              },
              {
                q: "What is the top college in India?",
                a: "IIT Bombay is ranked as the top college in India as per various rankings including Collegedunia 2025."
              },
              {
                q: "What is the fee range for colleges in India?",
                a: "The fee range varies from ₹10,000 per year in some government colleges to ₹40 Lakh in top private institutions."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CollegeListingPage;
