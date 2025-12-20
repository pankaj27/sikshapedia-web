import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiUser, FiBell, FiEdit3, FiGrid, FiGlobe, FiAward, FiDollarSign, FiBarChart2, FiTarget, FiFileText, FiInfo, FiPhone } from 'react-icons/fi';
import { Button } from '../ui/button';

/**
 * Custom NavLink component that handles navigation with full page reload
 * as a workaround for React Router v7 interference from external scripts.
 * This ensures navigation always works correctly even when React state updates are blocked.
 */
const NavLink = ({ to, children, className, onClick, ...props }) => {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    // Use full page reload to ensure navigation works
    window.location.href = to;
  }, [to, onClick]);
  
  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [allCoursesDropdownOpen, setAllCoursesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('Admission Goal');
  
  // Timeout refs for hover delay
  const goalTimeoutRef = useRef(null);
  const allCoursesTimeoutRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    // Check for user on mount only (no interval)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Hover handlers with delay for Goal dropdown
  const handleGoalMouseEnter = () => {
    if (goalTimeoutRef.current) {
      clearTimeout(goalTimeoutRef.current);
    }
    setGoalDropdownOpen(true);
  };

  const handleGoalMouseLeave = () => {
    goalTimeoutRef.current = setTimeout(() => {
      setGoalDropdownOpen(false);
    }, 200);
  };

  // Hover handlers with delay for All Courses dropdown
  const handleAllCoursesMouseEnter = () => {
    if (allCoursesTimeoutRef.current) {
      clearTimeout(allCoursesTimeoutRef.current);
    }
    setAllCoursesDropdownOpen(true);
  };

  const handleAllCoursesMouseLeave = () => {
    allCoursesTimeoutRef.current = setTimeout(() => {
      setAllCoursesDropdownOpen(false);
    }, 200);
  };

  const admissionGoals = [
    { name: 'School Admission', link: '/admission/schools' },
    { name: 'College Admission', link: '/admission/colleges' },
    { name: 'University Admission', link: '/admission/universities' },
    { name: 'Course', link: '/courses' },
    { name: 'Exam', link: '/exams' },
  ];

  const exploreMenuItems = [
    { title: 'News', link: '/news', icon: 'FiFileText' },
    { title: 'Study Abroad', link: '/study-abroad', icon: 'FiGlobe' },
    { title: 'Scholarships', link: '/scholarships', icon: 'FiAward' },
    { title: 'Education Loans', link: '/loans', icon: 'FiDollarSign' },
    { title: 'Compare Institute', link: '/compare', icon: 'FiBarChart2' },
    { title: 'College Predictor', link: '/eligibility-checker', icon: 'FiTarget' },
    { title: 'Blogs & Articles', link: '/blog', icon: 'FiFileText' },
    { title: 'About Us', link: '/about', icon: 'FiInfo' },
    { title: 'Contact', link: '/contact', icon: 'FiPhone' }
  ];

  return (
    <header className="bg-black/80 backdrop-blur-sm sticky top-0 z-[1000] w-full">
      {/* Main Header */}
      <div className="px-6">
        <div className="flex items-center justify-between h-16 gap-4 max-w-full relative">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/assets/main-logo.png" alt="Admission Buddy" className="h-7" />
          </Link>

          {/* Select Goal Dropdown - Desktop */}
          <div 
            className="hidden lg:flex relative goal-dropdown"
            onMouseEnter={handleGoalMouseEnter}
            onMouseLeave={handleGoalMouseLeave}
          >
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white hover:text-orange-400 transition-colors">
              <FiTarget size={16} />
              <span>{selectedGoal}</span>
              <FiChevronDown className={`transition-transform ${goalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {goalDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]"
                onMouseEnter={handleGoalMouseEnter}
                onMouseLeave={handleGoalMouseLeave}
              >
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
            {/* Write Review Button - White Color */}
            <Link to="/write-review">
              <button className="flex items-center gap-2 px-3 py-1 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white rounded-lg transition-colors">
                <FiEdit3 size={16} />
                <div className="text-left leading-tight">
                  <div className="text-xs font-semibold whitespace-nowrap">Write a Review</div>
                  <div className="text-[10px] whitespace-nowrap">Get Upto ₹300*</div>
                </div>
              </button>
            </Link>

            {/* Explore Dropdown */}
            <div 
              className="relative explore-dropdown-container"
              onMouseEnter={() => setExploreDropdownOpen(true)}
              onMouseLeave={() => {
                setTimeout(() => setExploreDropdownOpen(false), 200);
              }}
            >
              <button 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-orange-400 transition-colors border border-white/30 rounded-lg hover:border-orange-400"
              >
                <FiGrid size={16} />
                <span>Explore</span>
              </button>
              
              {exploreDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-[99999]"
                  onMouseEnter={() => setExploreDropdownOpen(true)}
                  onMouseLeave={() => {
                    setTimeout(() => setExploreDropdownOpen(false), 200);
                  }}
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
                </div>
              )}
            </div>

            {/* Auth Buttons / User Profile */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  {user.profile_photo_url ? (
                    <img src={user.profile_photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block font-medium">{user.name?.split(' ')[0]}</span>
                  <FiChevronDown className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FiGrid size={18} /> Dashboard
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      onClick={() => { setUserDropdownOpen(false); }}
                    >
                      <FiUser size={18} /> My Profile
                    </Link>
                    <div className="border-t my-1"></div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <FiX size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-orange-400 text-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-orange-400 transition-colors"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

      {/* Course Categories Bar - Desktop with Edge-to-Edge Border and Background */}
      <div className="hidden lg:block w-screen border-t border-white/20 bg-black/40 -mx-6 relative z-[1000]">
        <div className="overflow-visible relative">
          <div className="flex items-center gap-6 py-2 pl-6 pr-6 overflow-x-auto" style={{overflowY: 'visible'}} spellCheck="false">
            {/* All Courses Dropdown */}
            <div 
              className="relative z-[2000]"
              onMouseEnter={handleAllCoursesMouseEnter}
              onMouseLeave={handleAllCoursesMouseLeave}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors">
                All Courses
                <FiChevronDown size={14} />
              </button>
              
              {allCoursesDropdownOpen && (
                <div 
                  className="fixed top-[120px] left-6 w-80 bg-white rounded-lg shadow-2xl py-3 z-[99999] border-2 border-orange-500 max-h-[80vh] overflow-y-auto thin-scrollbar"
                  onMouseEnter={handleAllCoursesMouseEnter}
                  onMouseLeave={handleAllCoursesMouseLeave}
                >
                  <Link to="/courses" className="block px-4 py-2.5 text-base font-bold text-orange-600 hover:bg-orange-50 transition-colors">
                    📚 View All Courses
                  </Link>
                  <div className="border-t-2 border-gray-200 my-2"></div>
                  
                  <p className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50">🎓 ENGINEERING COURSES</p>
                  <Link to="/btech" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    B.Tech - Bachelor of Technology
                  </Link>
                  <Link to="/mtech" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    M.Tech - Master of Technology
                  </Link>
                  <Link to="/be" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    BE - Bachelor of Engineering
                  </Link>
                  <Link to="/me" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    ME - Master of Engineering
                  </Link>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  <p className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50">💼 MANAGEMENT COURSES</p>
                  <Link to="/mba" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    MBA - Master of Business Administration
                  </Link>
                  <Link to="/bba" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    BBA - Bachelor of Business Administration
                  </Link>
                  <Link to="/pgdm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    PGDM - Post Graduate Diploma in Management
                  </Link>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  <p className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50">🏥 MEDICAL COURSES</p>
                  <Link to="/mbbs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    MBBS - Bachelor of Medicine & Surgery
                  </Link>
                  <Link to="/bds" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    BDS - Bachelor of Dental Surgery
                  </Link>
                  <Link to="/bsc-nursing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    B.Sc Nursing - Bachelor of Science in Nursing
                  </Link>
                  <Link to="/bpharm" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    B.Pharm - Bachelor of Pharmacy
                  </Link>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  <p className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50">📊 COMMERCE COURSES</p>
                  <Link to="/bcom" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    B.Com - Bachelor of Commerce
                  </Link>
                  <Link to="/mcom" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    M.Com - Master of Commerce
                  </Link>
                  <Link to="/ca" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    CA - Chartered Accountant
                  </Link>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  <p className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50">🔬 SCIENCE COURSES</p>
                  <Link to="/bsc" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    B.Sc - Bachelor of Science
                  </Link>
                  <Link to="/msc" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    M.Sc - Master of Science
                  </Link>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  <p className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50">🎨 ARTS COURSES</p>
                  <Link to="/ba" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    BA - Bachelor of Arts
                  </Link>
                  <Link to="/ma" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    MA - Master of Arts
                  </Link>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  <p className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-50">💻 COMPUTER COURSES</p>
                  <Link to="/bca" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    BCA - Bachelor of Computer Applications
                  </Link>
                  <Link to="/mca" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                    MCA - Master of Computer Applications
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/schools" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              Schools
            </Link>
            <Link to="/btech" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Tech
            </Link>
            <Link to="/mba" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              MBA
            </Link>
            <Link to="/mbbs" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              MBBS
            </Link>
            <Link to="/bcom" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Com
            </Link>
            <Link to="/bsc" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Sc
            </Link>
            <Link to="/bsc-nursing" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              B.Sc (Nursing)
            </Link>
            <Link to="/ba" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              BA
            </Link>
            <Link to="/bba" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              BBA
            </Link>
            <Link to="/bca" className="text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              BCA
            </Link>
            <span className="text-white/30 mx-2">|</span>
            <Link to="/compare" className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              <FiBarChart2 size={14} />
              <span>Compare Institute</span>
            </Link>
            <Link to="/study-abroad" className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-orange-400 whitespace-nowrap transition-colors no-underline" spellCheck="false">
              <FiGlobe size={14} />
              <span>Study Abroad</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden py-4 border-t px-4 bg-white">
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

            {user ? (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-3 mb-4">
                  {user.profile_photo_url ? (
                    <img src={user.profile_photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full mb-2">
                    <FiGrid className="mr-2" /> Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  variant="ghost" 
                  className="w-full text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
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

  </header>
  );
};

export default Header;
