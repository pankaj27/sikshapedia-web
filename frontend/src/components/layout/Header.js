import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiChevronDown, FiUser } from 'react-icons/fi';
import { Button } from '../ui/button';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const exploreMenuItems = [
    { title: 'Study Abroad', link: '/study-abroad' },
    { title: 'Scholarships', link: '/scholarships' },
    { title: 'Loans', link: '/loans' },
    { title: 'Compare Colleges', link: '/compare' },
    { title: 'College Predictor', link: '/eligibility-checker' },
    { title: 'Blogs & Articles', link: '/blog' },
    { title: 'About Us', link: '/about' },
    { title: 'Contact', link: '/contact' }
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img src="/admissionbuddy-logo.png" alt="AdmissionBuddy" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <Link to="/colleges" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Colleges
            </Link>
            <Link to="/exams" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Exams
            </Link>
            <Link to="/courses" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
              Courses
            </Link>
            
            {/* Explore More Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setExploreDropdownOpen(true)}
              onMouseLeave={() => setExploreDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium transition-colors">
                Explore More
                <FiChevronDown className={`transition-transform ${exploreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {exploreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {exploreMenuItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search colleges, exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
              />
            </form>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <FiUser />
                    {user.name}
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-gray-700">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
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
              <Link to="/colleges" className="py-2 text-gray-700 hover:text-orange-600">
                Colleges
              </Link>
              <Link to="/exams" className="py-2 text-gray-700 hover:text-orange-600">
                Exams
              </Link>
              <Link to="/courses" className="py-2 text-gray-700 hover:text-orange-600">
                Courses
              </Link>
              
              <div className="border-t pt-2 mt-2">
                <p className="text-xs font-semibold text-gray-500 mb-2">EXPLORE MORE</p>
                {exploreMenuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className="block py-2 text-sm text-gray-700 hover:text-orange-600"
                  >
                    {item.title}
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
    </header>
  );
};

export default Header;
