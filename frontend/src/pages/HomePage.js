import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiTrendingUp, FiBookOpen, FiAward } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('colleges');
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
        api.get('/colleges/featured?limit=8'),
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

  const streams = [
    { name: 'Engineering', icon: '🔧', color: 'bg-blue-100 text-blue-700', count: '5000+' },
    { name: 'Medical', icon: '🏥', color: 'bg-red-100 text-red-700', count: '2000+' },
    { name: 'Management', icon: '💼', color: 'bg-green-100 text-green-700', count: '3000+' },
    { name: 'Commerce', icon: '💰', color: 'bg-yellow-100 text-yellow-700', count: '2500+' },
    { name: 'Arts', icon: '🎨', color: 'bg-purple-100 text-purple-700', count: '1800+' },
    { name: 'Science', icon: '🔬', color: 'bg-indigo-100 text-indigo-700', count: '2200+' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2" data-testid="logo">
              <div className="text-2xl font-bold">
                <span className="text-orange-600">Siksha</span>
                <span className="text-blue-600">pedia</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colleges" className="text-gray-700 hover:text-orange-600 font-medium">Colleges</Link>
              <Link to="/exams" className="text-gray-700 hover:text-orange-600 font-medium">Exams</Link>
              <Link to="/courses" className="text-gray-700 hover:text-orange-600 font-medium">Courses</Link>
              <Link to="/reviews" className="text-gray-700 hover:text-orange-600 font-medium">Reviews</Link>
              <Link to="/compare" className="text-gray-700 hover:text-orange-600 font-medium">Compare</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" data-testid="login-button">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-orange-600 hover:bg-orange-700" data-testid="register-button">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-orange-50 via-white to-blue-50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" data-testid="hero-title">
              Find Your Dream College
            </h1>
            <p className="text-xl text-gray-600">Explore 10,000+ Colleges, Exams, Courses & More</p>
          </div>

          {/* Search Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white rounded-t-lg shadow-lg">
              <TabsList className="w-full grid grid-cols-3 bg-gray-100 rounded-none h-14">
                <TabsTrigger value="colleges" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600" data-testid="tab-colleges">
                  <FiBookOpen className="mr-2" /> Colleges
                </TabsTrigger>
                <TabsTrigger value="exams" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600" data-testid="tab-exams">
                  <FiAward className="mr-2" /> Exams
                </TabsTrigger>
                <TabsTrigger value="courses" className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:text-orange-600" data-testid="tab-courses">
                  <FiTrendingUp className="mr-2" /> Courses
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colleges" className="p-6 m-0">
                <form onSubmit={handleSearch}>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Search by College Name, Course, or Location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-12 text-base"
                      data-testid="search-colleges-input"
                    />
                    <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700 px-8" data-testid="search-colleges-button">
                      <FiSearch className="mr-2" /> Search
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="exams" className="p-6 m-0">
                <div className="flex gap-3">
                  <Input placeholder="Search for Exams like JEE, NEET, CAT..." className="h-12 text-base" />
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 px-8">
                    <FiSearch className="mr-2" /> Search
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="courses" className="p-6 m-0">
                <div className="flex gap-3">
                  <Input placeholder="Search for Courses like BTech, MBBS, MBA..." className="h-12 text-base" />
                  <Button size="lg" className="bg-orange-600 hover:bg-orange-700 px-8">
                    <FiSearch className="mr-2" /> Search
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-orange-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div data-testid="stat-colleges">
              <div className="text-3xl font-bold mb-1">{stats.total_colleges}+</div>
              <div className="text-orange-100">Colleges</div>
            </div>
            <div data-testid="stat-reviews">
              <div className="text-3xl font-bold mb-1">{stats.total_reviews}+</div>
              <div className="text-orange-100">Reviews</div>
            </div>
            <div data-testid="stat-users">
              <div className="text-3xl font-bold mb-1">{stats.total_users}+</div>
              <div className="text-orange-100">Happy Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Stream */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8" data-testid="browse-streams-title">
            Browse Top Streams
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {streams.map((stream) => (
              <Link
                key={stream.name}
                to={`/colleges?course=${stream.name}`}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-orange-600 group"
                data-testid={`stream-${stream.name.toLowerCase()}`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stream.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{stream.name}</h3>
                  <p className="text-sm text-gray-500">{stream.count} Colleges</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Colleges */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900" data-testid="top-colleges-title">
              Top Colleges in India
            </h2>
            <Link to="/colleges">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50" data-testid="view-all-colleges">
                View All Colleges
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredColleges.map((college) => (
                <Link
                  key={college.id}
                  to={`/colleges/${college.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow border border-gray-200 hover:border-orange-600"
                  data-testid={`college-card-${college.id}`}
                >
                  <div className="relative h-40 bg-gradient-to-br from-blue-500 to-indigo-600">
                    {college.images?.[0] ? (
                      <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                        {college.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      #{college.ranking || 'N/A'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base mb-2 line-clamp-2 text-gray-900">{college.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <FiMapPin className="text-orange-600 flex-shrink-0" />
                      <span className="truncate">{college.location?.city}, {college.location?.state}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <span className="font-bold text-sm">{college.rating || 'N/A'}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-bold text-orange-600">₹{(college.average_fees / 100000).toFixed(1)}L</span>/yr
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12" data-testid="why-choose-title">
            Why Choose Sikshapedia?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBookOpen className="text-3xl text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">10,000+ Colleges</h3>
              <p className="text-gray-600 text-sm">Comprehensive database of colleges across India</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Authentic Reviews</h3>
              <p className="text-gray-600 text-sm">Real student reviews and ratings</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="text-3xl text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Latest Rankings</h3>
              <p className="text-gray-600 text-sm">Updated rankings and placement data</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-3xl text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Expert Guidance</h3>
              <p className="text-gray-600 text-sm">Free counseling and admission support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="cta-title">Start Your College Search Today!</h2>
          <p className="text-xl mb-8 text-orange-100">Find the perfect college that matches your dreams and aspirations</p>
          <div className="flex gap-4 justify-center">
            <Link to="/colleges">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100" data-testid="cta-explore">
                Explore Colleges
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-orange-800" data-testid="cta-compare">
                Compare Colleges
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Sikshapedia</h3>
              <p className="text-sm text-gray-400">Your trusted partner in finding the perfect college for your future.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Top Streams</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/colleges?course=Engineering" className="hover:text-orange-600">Engineering</Link></li>
                <li><Link to="/colleges?course=Medical" className="hover:text-orange-600">Medical</Link></li>
                <li><Link to="/colleges?course=Management" className="hover:text-orange-600">Management</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-orange-600">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-600">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-orange-600">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@sikshapedia.com</li>
                <li>Phone: +91-1234567890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Sikshapedia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
