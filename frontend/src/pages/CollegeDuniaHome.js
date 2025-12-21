import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiStar, FiMapPin, FiBookOpen, FiMail, FiCheck } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Link } from '../components/CustomLink';
const CollegeDuniaHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [stats, setStats] = useState({ total_colleges: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('colleges');
  const [activeRankingYear, setActiveRankingYear] = useState('2024');
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collegesRes, statsRes] = await Promise.all([
        api.get('/colleges/featured?limit=12&fields=minimal'),
        api.get('/stats')
      ]);
      setFeaturedColleges(collegesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error:', error);
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

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }
    
    setNewsletterLoading(true);
    setNewsletterMessage({ type: '', text: '' });
    
    try {
      const response = await api.post('/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterMessage({ type: 'success', text: response.data.message });
      setNewsletterEmail('');
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to subscribe. Please try again.';
      setNewsletterMessage({ type: 'error', text: errorMsg });
    } finally {
      setNewsletterLoading(false);
    }
  };

  const studyGoals = [
    { name: 'Engineering', icon: '🔧', courses: 'B.Tech, M.Tech', count: '5000+' },
    { name: 'Management', icon: '💼', courses: 'MBA, PGDM', count: '3000+' },
    { name: 'Medical', icon: '🏥', courses: 'MBBS, BDS', count: '2000+' },
    { name: 'Commerce', icon: '💰', courses: 'B.Com, M.Com', count: '2500+' },
    { name: 'Arts', icon: '🎨', courses: 'BA, MA', count: '1800+' },
    { name: 'Science', icon: '🔬', courses: 'B.Sc, M.Sc', count: '2200+' },
    { name: 'Law', icon: '⚖️', courses: 'LLB, LLM', count: '1000+' },
    { name: 'Design', icon: '✏️', courses: 'B.Des, M.Des', count: '800+' }
  ];

  const programs = [
    { title: 'College Ranking', subtitle: 'Find Top Colleges', icon: '🏆', color: 'bg-orange-100' },
    { title: 'Exams', subtitle: 'JEE, NEET, CAT', icon: '📝', color: 'bg-blue-100' },
    { title: 'Compare Colleges', subtitle: 'Side by Side', icon: '⚖️', color: 'bg-green-100' },
    { title: 'Course Finder', subtitle: 'Find Best Courses', icon: '🎓', color: 'bg-purple-100' }
  ];

  const cities = [
    { name: 'Delhi', image: '/assets/city/delhi.svg' },
    { name: 'Mumbai', image: '/assets/city/mumbai.svg' },
    { name: 'Bangalore', image: '/assets/city/bangalore.svg' },
    { name: 'Hyderabad', image: '/assets/city/hyderabad.svg' },
    { name: 'Chennai', image: '/assets/city/chennai.svg' },
    { name: 'Pune', image: '/assets/city/pune.svg' },
    { name: 'Kolkata', image: '/assets/Kolkata.svg' },
    { name: 'Indore', image: '/assets/Indore.svg' }
  ];

  const rankingAgencies = ['India Today', 'NIRF', 'The Week', 'Outlook'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/sikshapedia_logo.png" alt="Sikshapedia" className="h-8" onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }} />
              <div className="text-2xl font-bold" style={{display: 'none'}}>
                <span className="text-orange-600">Siksha</span>
                <span className="text-blue-600">pedia</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/colleges" className="text-gray-700 hover:text-orange-600 font-medium">Colleges</Link>
              <Link to="/exams" className="text-gray-700 hover:text-orange-600 font-medium">Exams</Link>
              <Link to="/courses" className="text-gray-700 hover:text-orange-600 font-medium">Courses</Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium">
                  Explore More <FiChevronDown />
                </button>
                <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg p-4 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/rankings" className="block py-2 hover:text-orange-600">Rankings</Link>
                  <Link to="/reviews" className="block py-2 hover:text-orange-600">Reviews</Link>
                  <Link to="/compare" className="block py-2 hover:text-orange-600">Compare Colleges</Link>
                  <Link to="/study-abroad" className="block py-2 hover:text-orange-600">Study Abroad</Link>
                </div>
              </div>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <button className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                <FiSearch /> Search
              </button>
              <Link to="/signup">
                <Button variant="ghost" className="hidden md:inline-flex">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-orange-600 hover:bg-orange-700 hidden md:inline-flex">Sign Up</Button>
              </Link>
              <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link to="/colleges" className="block py-2">Colleges</Link>
              <Link to="/exams" className="block py-2">Exams</Link>
              <Link to="/courses" className="block py-2">Courses</Link>
              <Link to="/rankings" className="block py-2">Rankings</Link>
              <Link to="/signup" className="block py-2">Login</Link>
              <Link to="/signup" className="block py-2 text-orange-600">Sign Up</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section with Background Slider */}
      <section className="relative h-[500px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop
          className="h-full"
        >
          {['/assets/slider1.jpg', '/assets/slider2.jpg', '/assets/slider3.jpg', '/assets/slider4.jpg'].map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-full">
                <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => {
                  e.target.src = `/assets/banner${idx + 1}.jpg`;
                }} />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Search Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream College</h1>
            <p className="text-xl mb-8">Explore 10,000+ Colleges, Courses & Exams</p>
            
            {/* Search Tabs */}
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              <div className="flex border-b">
                {['colleges', 'exams', 'courses'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 font-semibold capitalize ${
                      activeTab === tab 
                        ? 'bg-orange-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSearch} className="p-6">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 text-lg"
                  />
                  <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700 px-8">
                    <FiSearch className="mr-2" /> Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Study Goals Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Select Your Study Goal</h2>
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 }
            }}
          >
            {studyGoals.map((goal, idx) => (
              <SwiperSlide key={idx}>
                <Link to={`/colleges?course=${goal.name}`} className="block bg-white rounded-lg p-6 text-center hover:shadow-lg transition border">
                  <div className="text-5xl mb-3">{goal.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{goal.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{goal.courses}</p>
                  <span className="text-xs text-orange-600 font-semibold">{goal.count} Colleges</span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Programs Exploration */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, idx) => (
              <div key={idx} className={`${program.color} rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer`}>
                <div className="text-5xl mb-3">{program.icon}</div>
                <h3 className="font-bold text-xl mb-2">{program.title}</h3>
                <p className="text-gray-600">{program.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities Carousel */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Top Universities & Colleges</h2>
            <Link to="/colleges">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">View All</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
            >
              {featuredColleges.map((college) => (
                <SwiperSlide key={college.id}>
                  <Link to={`/colleges/${college.id}`} className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition">
                    <div className="relative h-40 bg-gradient-to-br from-blue-500 to-indigo-600">
                      {college.images?.[0] ? (
                        <img src={college.images[0]} alt={college.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                          {college.name.charAt(0)}
                        </div>
                      )}
                      {college.nirf_ranking && (
                        <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-sm font-bold">
                          #{college.nirf_ranking}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2">{college.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                        <FiMapPin className="text-orange-600" />
                        <span className="truncate">{college.location?.city}, {college.location?.state}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <FiStar className="text-yellow-500" />
                          <span className="font-bold text-sm">{college.rating || 'N/A'}</span>
                        </div>
                        <span className="text-orange-600 font-bold text-sm">
                          ₹{(college.average_fees / 100000).toFixed(1)}L/yr
                        </span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Ranking Table */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">College Rankings {activeRankingYear}</h2>
            <select 
              value={activeRankingYear}
              onChange={(e) => setActiveRankingYear(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {rankingAgencies.map((agency, idx) => (
              <button
                key={idx}
                className="px-4 py-2 bg-white border rounded-full hover:border-orange-600 hover:text-orange-600 whitespace-nowrap"
              >
                {agency}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fees</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {featuredColleges.slice(0, 10).map((college, idx) => (
                  <tr key={college.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <Link to={`/colleges/${college.id}`} className="font-semibold hover:text-orange-600">
                        {college.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {college.location?.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-500" />
                        <span className="font-semibold">{college.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                      ₹{(college.average_fees / 100000).toFixed(1)}L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Explore Colleges in Popular Places</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {cities.map((city, idx) => (
              <Link
                key={idx}
                to={`/colleges?city=${city.name}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition"
              >
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                  <img src={city.image} alt={city.name} className="w-10 h-10" onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = city.name.charAt(0);
                  }} />
                </div>
                <h3 className="font-semibold text-sm">{city.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <FiMail className="text-5xl mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-8 text-orange-100">Get the latest updates on college admissions, exams, and education news</p>
          
          {newsletterMessage.text && (
            <div className={`max-w-2xl mx-auto mb-4 p-3 rounded-lg flex items-center justify-center gap-2 ${
              newsletterMessage.type === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
            }`}>
              {newsletterMessage.type === 'success' && <FiCheck className="text-xl" />}
              {newsletterMessage.text}
            </div>
          )}
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="h-12 bg-white text-gray-900 flex-1"
              disabled={newsletterLoading}
            />
            <Button 
              type="submit"
              size="lg" 
              variant="secondary" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 h-12"
              disabled={newsletterLoading}
            >
              {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-sm text-orange-200 mt-4">Join 10,000+ students getting admission updates</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Sikshapedia</h3>
              <p className="text-sm">Your trusted partner in finding the perfect college for your future.</p>
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
                <li><Link to="/admin" className="hover:text-orange-600">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-orange-600">FB</a>
                <a href="#" className="hover:text-orange-600">TW</a>
                <a href="#" className="hover:text-orange-600">IG</a>
                <a href="#" className="hover:text-orange-600">LI</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Sikshapedia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CollegeDuniaHome;