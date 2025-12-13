import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiUser, FiBell, FiEdit3, FiGrid, FiGlobe, FiAward, FiDollarSign, FiBarChart2, FiTarget, FiFileText, FiInfo, FiPhone } from 'react-icons/fi';
import { Button } from '../ui/button';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('Select Admission Goal');
  const exploreButtonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (exploreDropdownOpen && exploreButtonRef.current) {
      const rect = exploreButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [exploreDropdownOpen]);

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

  const admissionGoals = [
    { name: 'School Admission', link: '/colleges?type=school' },
    { name: 'College Admission', link: '/colleges' },
    { name: 'University Admission', link: '/colleges?type=university' },
    { name: 'Course', link: '/courses' },
    { name: 'Exam', link: '/exams' },
  ];

  const exploreMenuItems = [
    { title: 'Study Abroad', link: '/study-abroad', icon: 'FiGlobe' },
    { title: 'Scholarships', link: '/scholarships', icon: 'FiAward' },
    { title: 'Education Loans', link: '/loans', icon: 'FiDollarSign' },
    { title: 'Compare Colleges', link: '/compare', icon: 'FiBarChart2' },
    { title: 'College Predictor', link: '/eligibility-checker', icon: 'FiTarget' },
    { title: 'Blogs & Articles', link: '/blog', icon: 'FiFileText' },
    { title: 'About Us', link: '/about', icon: 'FiInfo' },
    { title: 'Contact', link: '/contact', icon: 'FiPhone' }
  ];

  return (
    <header className="bg-black/60 backdrop-blur-sm sticky top-0 z-[100] w-full">
      {/* Main Header */}
      <div className="px-6">
        <div className="flex items-center justify-between h-16 gap-4 max-w-full relative">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/assets/footer-logo.png" alt="Admission Buddy" className="h-12" />
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
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]">
                {admissionGoals.map((goal, idx) => (
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
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 min-w-0 max-w-3xl mx-4">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for Colleges, Exams, Courses and More..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </form>

          {/* Right Side Actions - Desktop */}
          <div className="hidden lg:flex items-center gap-3 relative">
            {/* Write Review Button */}
            <Link to="/colleges">
              <button className="flex items-center gap-2 px-3 py-1 border-2 border-orange-500 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors">
                <FiEdit3 size={16} />
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold whitespace-nowrap">Write a Review</div>
                  <div className="text-[10px] whitespace-nowrap">Get Upto ₹300*</div>
                </div>
              </button>
            </Link>

            {/* Explore Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setExploreDropdownOpen(true)}
              onMouseLeave={() => setExploreDropdownOpen(false)}
            >
              <button 
                ref={exploreButtonRef}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-orange-400 transition-colors border border-white/30 rounded-lg hover:border-orange-400"
              >
                <FiGrid size={16} />
                <span>Explore</span>
              </button>
              
              {exploreDropdownOpen && createPortal(
                <div 
                  className="fixed w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-[99999]"
                  style={{ 
                    top: `${dropdownPosition.top}px`, 
                    right: `${dropdownPosition.right}px` 
                  }}
                  onMouseEnter={() => setExploreDropdownOpen(true)}
                  onMouseLeave={() => setExploreDropdownOpen(false)}
                >
                  <div className="flex flex-col gap-1">
                    {exploreMenuItems.map((item, idx) => {
                      const iconComponents = { FiGlobe, FiAward, FiDollarSign, FiBarChart2, FiTarget, FiFileText, FiInfo, FiPhone };
                      const IconComponent = iconComponents[item.icon] || FiGrid;
                      return (
                        <Link
                          key={idx}
                          to={item.link}
                          onClick={() => setExploreDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <IconComponent className="text-lg" />
                          <span>{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>,
                document.body
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
            className="lg:hidden p-2 text-white hover:text-orange-400"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

      {/* Course Categories Bar - Desktop with Edge-to-Edge Border and Background */}
      <div className="hidden lg:block w-screen border-t border-white/20 bg-black/40 -mx-6">
        <div>
          <div className="flex items-center gap-6 py-2 pl-6 pr-6 overflow-x-auto" spellCheck="false">
            <Link to="/courses" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              All Courses
            </Link>
            <Link to="/courses?type=btech" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Tech
            </Link>
            <Link to="/courses?type=mba" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              MBA
            </Link>
            <Link to="/courses?type=mtech" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              M.Tech
            </Link>
            <Link to="/courses?type=mbbs" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              MBBS
            </Link>
            <Link to="/courses?type=bcom" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Com
            </Link>
            <Link to="/courses?type=bsc" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Sc
            </Link>
            <Link to="/courses?type=bsc-nursing" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Sc (Nursing)
            </Link>
            <Link to="/courses?type=ba" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              BA
            </Link>
            <Link to="/courses?type=bba" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              BBA
            </Link>
            <Link to="/courses?type=bca" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              BCA
            </Link>
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
              <p className="text-xs font-semibold text-gray-500 mb-2">ADMISSION GOALS</p>
              {admissionGoals.map((goal, idx) => (
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
              {exploreMenuItems.map((item, idx) => {
                const iconComponents = { FiGlobe, FiAward, FiDollarSign, FiBarChart2, FiTarget, FiFileText, FiInfo, FiPhone };
                const IconComponent = iconComponents[item.icon] || FiGrid;
                return (
                  <Link
                    key={idx}
                    to={item.link}
                    className="flex items-center gap-2 py-2 text-sm text-gray-700 hover:text-orange-600"
                  >
                    <IconComponent />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
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

    {/* Floating Action Buttons - Below Sign Up */}
    <div className="hidden lg:flex fixed right-6 top-20 flex-col gap-2 z-40">
      <Link to="/compare">
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg shadow-md transition-all whitespace-nowrap">
          Compare Colleges
        </button>
      </Link>
      <Link to="/study-abroad">
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-md transition-all whitespace-nowrap">
          Study Abroad
        </button>
      </Link>
    </div>

  </header>
  );
};

export default Header;
