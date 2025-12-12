import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBook, FiStar, FiUsers, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [stats, setStats] = useState({ total_colleges: 0, total_reviews: 0, total_users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collegesRes, statsRes] = await Promise.all([
        api.get('/colleges/featured?limit=6'),
        api.get('/stats')
      ]);
      setFeaturedColleges(collegesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="landing-hero-title">
              Find Your Dream College
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100" data-testid="landing-hero-subtitle">
              Discover, Compare, and Connect with Top Universities
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex gap-2 bg-white rounded-lg p-2 shadow-xl">
              <div className="flex-1 flex items-center gap-2 px-2">
                <FiSearch className="text-gray-400 text-xl" />
                <Input
                  type="text"
                  placeholder="Search colleges, courses, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 text-gray-900"
                  data-testid="search-input"
                />
              </div>
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700" data-testid="search-button">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div data-testid="stat-colleges">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total_colleges}+</div>
              <div className="text-gray-600">Colleges Listed</div>
            </div>
            <div data-testid="stat-reviews">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total_reviews}+</div>
              <div className="text-gray-600">Student Reviews</div>
            </div>
            <div data-testid="stat-users">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.total_users}+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="browse-categories-title">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Engineering', icon: FiBook, query: 'BTech' },
              { name: 'Medical', icon: FiAward, query: 'MBBS' },
              { name: 'Management', icon: FiUsers, query: 'MBA' },
              { name: 'Arts & Science', icon: FiStar, query: 'Arts' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/colleges?course=${category.query}`}
                className="p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow text-center group"
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <category.icon className="text-4xl text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold" data-testid="featured-colleges-title">Top Rated Colleges</h2>
            <Link to="/colleges">
              <Button variant="outline" data-testid="view-all-button">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredColleges.map((college) => (
                <Link
                  key={college.id}
                  to={`/colleges/${college.id}`}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow border"
                  data-testid={`college-card-${college.id}`}
                >
                  <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    {college.images?.[0] ? (
                      <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-white text-4xl font-bold">
                        {college.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{college.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <FiMapPin className="text-blue-600" />
                      <span>{college.location?.city}, {college.location?.state}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <span className="font-semibold">{college.rating || 'N/A'}</span>
                        <span className="text-sm text-gray-500">({college.total_reviews})</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">₹{(college.average_fees / 100000).toFixed(1)}L</span>/year
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12" data-testid="why-sikshapedia-title">Why Choose Sikshapedia?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="feature-verified">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Verified Information</h3>
              <p className="text-gray-600">Accurate and up-to-date college information</p>
            </div>
            <div className="text-center" data-testid="feature-reviews">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Real Student Reviews</h3>
              <p className="text-gray-600">Genuine feedback from current students</p>
            </div>
            <div className="text-center" data-testid="feature-compare">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Easy Comparison</h3>
              <p className="text-gray-600">Compare colleges side by side</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="cta-title">Ready to Find Your Perfect College?</h2>
          <p className="text-xl mb-8 text-blue-100">Start exploring thousands of colleges and make an informed decision</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/colleges">
              <Button size="lg" variant="secondary" data-testid="cta-browse-button">
                Browse Colleges
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" data-testid="cta-register-button">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
