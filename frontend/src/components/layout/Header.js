import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiUser, FiBell, FiEdit3, FiGrid } from 'react-icons/fi';
import { Button } from '../ui/button';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('Select Goal');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const studyGoals = [
    { name: 'All Courses', link: '/courses' },
    { name: 'B.Tech', link: '/courses?type=btech' },
    { name: 'MBA', link: '/courses?type=mba' },
    { name: 'M.Tech', link: '/courses?type=mtech' },
    { name: 'MBBS', link: '/courses?type=mbbs' },
    { name: 'B.Com', link: '/courses?type=bcom' },
    { name: 'B.Sc', link: '/courses?type=bsc' },
    { name: 'B.Sc (Nursing)', link: '/courses?type=bsc-nursing' },
    { name: 'BA', link: '/courses?type=ba' },
    { name: 'BBA', link: '/courses?type=bba' },
    { name: 'BCA', link: '/courses?type=bca' }
  ];

  const exploreMenuItems = [
    { title: 'Study Abroad', link: '/study-abroad', icon: '✈️' },
    { title: 'Scholarships', link: '/scholarships', icon: '💰' },
    { title: 'Education Loans', link: '/loans', icon: '🏦' },
    { title: 'Compare Colleges', link: '/compare', icon: '⚖️' },
    { title: 'College Predictor', link: '/eligibility-checker', icon: '🎯' },
    { title: 'Blogs & Articles', link: '/blog', icon: '📝' },
    { title: 'About Us', link: '/about', icon: 'ℹ️' },
    { title: 'Contact', link: '/contact', icon: '📞' }
  ];

  return (
    <header className="bg-black/60 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/admissionbuddy-logo.png" alt="AdmissionBuddy" className="h-10" />
          </Link>

          {/* Select Goal Dropdown - Desktop */}
          <div 
            className="hidden lg:flex relative goal-dropdown"
            onMouseEnter={() => setGoalDropdownOpen(true)}
            onMouseLeave={() => setGoalDropdownOpen(false)}
          >
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-orange-400 transition-colors">
              <span>🎓</span>
              <span>{selectedGoal}</span>
              <FiChevronDown className={`transition-transform ${goalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {goalDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {studyGoals.map((goal, idx) => (
                  <Link
                    key={idx}
                    to={goal.link}
                    onClick={() => {
                      setSelectedGoal(goal.name);
                      setGoalDropdownOpen(false);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {goal.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Colleges, Exams, Courses and More..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-white placeholder-gray-300"
              />
            </div>
          </form>

          {/* Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Write Review Button */}
            <Link to="/colleges">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 border-orange-500 text-orange-400 hover:bg-orange-500/20 text-sm bg-white/5"
              >
                <FiEdit3 size={16} />
                <div className="text-left">
                  <div className="font-semibold">Write a Review</div>
                  <div className="text-xs">Get Upto ₹300*</div>
                </div>
              </Button>
            </Link>

            {/* Explore Dropdown */}
            <div 
              className="relative explore-dropdown"
              onMouseEnter={() => setExploreDropdownOpen(true)}
              onMouseLeave={() => setExploreDropdownOpen(false)}
            >
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-orange-400 transition-colors border border-white/20 rounded-lg hover:border-orange-400 bg-white/5">
                <FiGrid />
                <span>Explore</span>
              </button>
              
              {exploreDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {exploreMenuItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.link}
                        onClick={() => setExploreDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors rounded"
                      >
                        <span>{item.icon}</span>
                        <span className="text-xs">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button className="p-2 text-white hover:text-orange-400 transition-colors relative">
              <FiBell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Auth Buttons / User Profile */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-orange-400">
                    <FiUser />
                    {user.name}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-orange-400 text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Hamburger Menu Icon */}
            <button className="p-2 text-white hover:text-orange-400 transition-colors">
              <FiMenu size={24} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

      {/* Course Categories Bar - Desktop */}
      <div className="hidden lg:block border-t border-white/10 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-2 overflow-x-auto">
            <Link to="/courses" className="text-sm font-medium text-white/90 hover:text-orange-400 whitespace-nowrap transition-colors">
              All Courses
            </Link>
            {studyGoals.slice(1, 11).map((goal, idx) => (
              <Link
                key={idx}
                to={goal.link}
                className="text-sm font-medium text-white/90 hover:text-orange-400 whitespace-nowrap transition-colors"
              >
                {goal.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 border-t">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </form>

          <nav className="flex flex-col gap-2">
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-2">STUDY GOALS</p>
              {studyGoals.map((goal, idx) => (
                <Link
                  key={idx}
                  to={goal.link}
                  className="block py-2 text-sm text-gray-700 hover:text-orange-600"
                >
                  {goal.name}
                </Link>
              ))}
            </div>

            <div className="border-t pt-2 mt-2">
              <p className="text-xs font-semibold text-gray-500 mb-2">EXPLORE MORE</p>
              {exploreMenuItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-orange-600"
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            {!user && (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </div>

    {/* Quick Action Buttons (Study Abroad & Course Finder) - Floating */}
    <div className="hidden lg:flex fixed right-6 top-20 flex-col gap-2 z-40">
      <Link to="/study-abroad">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-lg flex items-center gap-2">
          <FiSearch size={16} />
          Study Abroad
        </Button>
      </Link>
      <Link to="/courses">
        <Button className="bg-green-600 hover:bg-green-700 text-white text-sm shadow-lg flex items-center gap-2 relative">
          <FiSearch size={16} />
          Course Finder
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">NEW</span>
        </Button>
      </Link>
    </div>
  </header>
  );
};

export default Header;
