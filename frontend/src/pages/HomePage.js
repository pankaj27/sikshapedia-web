import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiStar, FiMapPin, FiBookOpen, FiFileText, FiAward, FiTrendingUp, FiZap } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import MetaTags from '../components/SEO/MetaTags';
import { OrganizationSchema, WebsiteSchema } from '../components/SEO/StructuredData';
import LocationSearch from '../components/LocationSearch';
import LatestNews from '../components/LatestNews';
import TopCollegesByStream from '../components/TopCollegesByStream';
import TopExams from '../components/TopExams';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CollegeDuniaHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [stats, setStats] = useState({ total_colleges: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRankingYear, setActiveRankingYear] = useState('2024');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collegesRes, statsRes] = await Promise.all([
        api.get('/colleges/featured?limit=12'),
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

  const studyGoals = [
    { name: 'Engineering', icon: 'FiTool', courses: 'B.Tech, M.Tech', count: '5000+', color: 'text-blue-600' },
    { name: 'Management', icon: 'FiBriefcase', courses: 'MBA, PGDM', count: '3000+', color: 'text-purple-600' },
    { name: 'Medical', icon: 'FiActivity', courses: 'MBBS, BDS', count: '2000+', color: 'text-red-600' },
    { name: 'Commerce', icon: 'FiTrendingUp', courses: 'B.Com, M.Com', count: '2500+', color: 'text-green-600' },
    { name: 'Arts', icon: 'FiFeather', courses: 'BA, MA', count: '1800+', color: 'text-pink-600' },
    { name: 'Science', icon: 'FiCpu', courses: 'B.Sc, M.Sc', count: '2200+', color: 'text-indigo-600' },
    { name: 'Law', icon: 'FiShield', courses: 'LLB, LLM', count: '1000+', color: 'text-yellow-600' },
    { name: 'Design', icon: 'FiLayout', courses: 'B.Des, M.Des', count: '800+', color: 'text-orange-600' }
  ];

  const programs = [
    { title: 'College Ranking', subtitle: 'Find Top Colleges', icon: 'FiAward', color: 'bg-orange-100', iconColor: 'text-orange-600' },
    { title: 'Exams', subtitle: 'JEE, NEET, CAT', icon: 'FiFileText', color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { title: 'Compare Colleges', subtitle: 'Side by Side', icon: 'FiBarChart2', color: 'bg-green-100', iconColor: 'text-green-600' },
    { title: 'Course Finder', subtitle: 'Find Best Courses', icon: 'FiCompass', color: 'bg-purple-100', iconColor: 'text-purple-600' }
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
      <MetaTags 
        title="AdmissionBuddy - Top Colleges, Universities & Institutes in India | Admission 2024"
        description="Find detailed information about 10,000+ colleges, universities, courses, exams in India. Compare colleges, check rankings, fees, cutoffs, and admission details. Read reviews and make informed decisions."
        keywords="colleges in india, top universities, engineering colleges, medical colleges, MBA colleges, admissions 2024, college rankings, NIRF rankings, JEE, NEET, CAT preparation, course finder, study abroad"
        canonical="/"
      />
      <OrganizationSchema />
      <WebsiteSchema />
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
          <div className="text-center text-white max-w-4xl px-4 w-full">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 drop-shadow-lg">Find Over 250+ Exams in India</h1>
            
            {/* Single Search Input - No Background Container */}
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch}>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Search for colleges, exams, courses and more.."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-14 text-base pl-12 pr-4 bg-white border-0 rounded-lg shadow-xl focus:ring-2 focus:ring-orange-500 transition-all"
                    />
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 h-14 px-10 text-base font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Need Counselling Button */}
            <div className="mt-6">
              <Link to="/counseling">
                <Button 
                  type="button" 
                  className="bg-white text-orange-600 hover:bg-gray-50 h-12 px-8 text-base font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Need Counselling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/colleges" className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition">
                <FiBookOpen className="text-blue-600 text-2xl" />
              </div>
              <span className="text-sm font-semibold text-center">All Colleges</span>
            </Link>
            <Link to="/exams" className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition">
                <FiFileText className="text-green-600 text-2xl" />
              </div>
              <span className="text-sm font-semibold text-center">All Exams</span>
            </Link>
            <Link to="/courses" className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-200 transition">
                <FiBookOpen className="text-purple-600 text-2xl" />
              </div>
              <span className="text-sm font-semibold text-center">All Courses</span>
            </Link>
            <Link to="/scholarships" className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition group">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-yellow-200 transition">
                <FiAward className="text-yellow-600 text-2xl" />
              </div>
              <span className="text-sm font-semibold text-center">Scholarships</span>
            </Link>
            <Link to="/loans" className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition group">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-pink-200 transition">
                <FiTrendingUp className="text-pink-600 text-2xl" />
              </div>
              <span className="text-sm font-semibold text-center">Education Loans</span>
            </Link>
            <Link to="/study-materials" className="flex flex-col items-center p-4 rounded-lg hover:bg-orange-50 transition group">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition">
                <FiZap className="text-indigo-600 text-2xl" />
              </div>
              <span className="text-sm font-semibold text-center">Study Materials</span>
            </Link>
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
          <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Admissions</h2>
          <p className="text-xl mb-8 text-orange-100">Get alerts for admission dates, exams, and more</p>
          <form className="max-w-2xl mx-auto flex gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 bg-white text-gray-900"
            />
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100 px-8">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Top Colleges by Stream */}
      <TopCollegesByStream />

      {/* Top Entrance Exams */}
      <TopExams />

      {/* Location-based Search */}
      <LocationSearch />

      {/* Latest News & Alerts */}
      <LatestNews />

    </div>
  );
};

export default CollegeDuniaHome;