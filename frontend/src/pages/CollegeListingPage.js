import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiBookmark, FiChevronDown } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';

const CollegeListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    type: [],
    course: '',
    minFees: '',
    maxFees: '',
  });

  useEffect(() => {
    fetchColleges();
  }, [searchParams]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      const response = await api.get(`/colleges?${params.toString()}`);
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src="/admissionbuddy-logo.png" alt="AdmissionBuddy" className="h-10" />
            </Link>
            <div className="flex-1 max-w-xl mx-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search colleges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
            </div>
            <div className="flex gap-3">
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button className="bg-orange-600 hover:bg-orange-700">Sign Up</Button></Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-20">
              <h3 className="font-bold text-lg mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="font-semibold text-sm mb-2 block">College Type</label>
                  <div className="space-y-2">
                    {['Government', 'Private', 'Deemed'].map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <Checkbox />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-sm mb-2 block">Location</label>
                  <Input placeholder="City" className="mb-2" />
                  <Input placeholder="State" />
                </div>

                <div>
                  <label className="font-semibold text-sm mb-2 block">Fees Range</label>
                  <div className="flex gap-2">
                    <Input placeholder="Min" type="number" />
                    <Input placeholder="Max" type="number" />
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">Apply Filters</Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {loading ? 'Loading...' : `${colleges.length} Colleges Found`}
              </h1>
              <select className="border rounded px-3 py-2">
                <option>Sort by Relevance</option>
                <option>Rating: High to Low</option>
                <option>Fees: Low to High</option>
                <option>Ranking</option>
              </select>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 bg-gray-200 rounded"></div>
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
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">No colleges found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {colleges.map((college) => (
                  <div key={college.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
                    <div className="p-6">
                      <div className="flex gap-6">
                        {/* College Image */}
                        <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg overflow-hidden">
                          {college.images?.[0] ? (
                            <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                              {college.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* College Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <Link to={`/colleges/${college.id}`} className="text-xl font-bold text-gray-900 hover:text-orange-600">
                                {college.name}
                              </Link>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <FiMapPin className="text-orange-600" />
                                <span>{college.location?.city}, {college.location?.state}</span>
                                <span className="mx-2">•</span>
                                <span className="text-blue-600 font-medium">{college.type}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-sm">
                                <FiStar className="inline mr-1" />
                                {college.rating || 'N/A'}
                              </div>
                              <Button variant="ghost" size="sm">
                                <FiBookmark />
                              </Button>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3 line-clamp-2">{college.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-4 text-sm">
                              <span className="text-gray-600">
                                <span className="font-semibold text-gray-900">{college.total_courses}</span> Courses
                              </span>
                              <span className="text-gray-600">
                                Estd. <span className="font-semibold text-gray-900">{college.established_year}</span>
                              </span>
                              {college.ranking && (
                                <span className="text-orange-600 font-semibold">Rank #{college.ranking}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-xs text-gray-600">Avg. Fees</div>
                                <div className="text-xl font-bold text-orange-600">
                                  ₹{(college.average_fees / 100000).toFixed(1)}L/yr
                                </div>
                              </div>
                              <Link to={`/colleges/${college.id}`}>
                                <Button className="bg-orange-600 hover:bg-orange-700">View Details</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CollegeListingPage;
