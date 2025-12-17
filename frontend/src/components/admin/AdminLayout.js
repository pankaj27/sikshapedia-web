import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiBook, FiFileText, FiAward, FiGrid, 
  FiLogOut, FiChevronDown, FiChevronRight, FiBookOpen, FiTag,
  FiSettings, FiDatabase, FiLink, FiDollarSign, FiMessageSquare
} from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(['content', 'tagging']);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => 
      prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: FiHome,
      path: '/admin/dashboard'
    },
    {
      id: 'content',
      title: 'Content Management',
      icon: FiDatabase,
      submenu: [
        { title: 'Institution Entry', path: '/admin/colleges', icon: FiHome },
        { title: 'Courses (Quick Entry)', path: '/admin/courses', icon: FiBook },
        { title: 'Course Details', path: '/admin/courses-detail', icon: FiBook },
        { title: 'Exams (Quick Entry)', path: '/admin/exams', icon: FiFileText },
        { title: 'Exam Details', path: '/admin/exams-detail', icon: FiFileText },
        { title: 'News Articles', path: '/admin/news', icon: FiFileText },
        { title: 'Blogs', path: '/admin/blogs', icon: FiFileText },
        { title: 'Scholarships', path: '/admin/scholarships', icon: FiDollarSign },
        { title: 'Loans', path: '/admin/loans', icon: FiDollarSign },
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Elements',
      icon: FiGrid,
      submenu: [
        { title: 'Banners & Sliders', path: '/admin/banners', icon: FiGrid },
        { title: 'Testimonials', path: '/admin/testimonials', icon: FiUsers },
        { title: 'FAQs', path: '/admin/faqs', icon: FiFileText },
        { title: 'Cities', path: '/admin/cities', icon: FiGrid },
        { title: 'Listing Pages', path: '/admin/listing-pages', icon: FiGlobe },
      ]
    },
    {
      id: 'taxonomy',
      title: 'Taxonomy & Masters',
      icon: FiGrid,
      submenu: [
        { title: 'Streams', path: '/admin/streams', icon: FiGrid },
        { title: 'Sub-Streams', path: '/admin/sub-streams', icon: FiGrid },
        { title: 'Boards (Schools)', path: '/admin/boards', icon: FiGrid },
        { title: 'College Types', path: '/admin/college-types', icon: FiGrid },
        { title: 'Affiliations', path: '/admin/affiliations', icon: FiGrid },
        { title: 'Recognitions', path: '/admin/recognitions', icon: FiGrid },
        { title: 'Accreditations', path: '/admin/accreditations', icon: FiGrid },
        { title: 'Accreditation Levels', path: '/admin/accreditation-levels', icon: FiGrid },
        { title: 'Rankings', path: '/admin/rankings', icon: FiGrid },
        { title: 'Rank Categories', path: '/admin/rank-categories', icon: FiGrid },
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      icon: FiUsers,
      submenu: [
        { title: 'All Users', path: '/admin/users', icon: FiUsers },
        { title: 'Student Data Collection', path: '/admin/student-data', icon: FiUsers },
      ]
    },
    {
      id: 'moderation',
      title: 'Moderation & Inquiries',
      icon: FiMessageSquare,
      submenu: [
        { title: 'Reviews', path: '/admin/reviews', icon: FiMessageSquare },
        { title: 'Comments', path: '/admin/comments', icon: FiMessageSquare },
    { title: 'Advertisements', path: '/admin/advertisements', icon: FiDollarSign },
        { title: 'Contact Inquiries', path: '/admin/contact-inquiries', icon: FiMessageSquare },
        { title: 'Counseling Requests', path: '/admin/counseling-sessions', icon: FiMessageSquare },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;
  const isParentActive = (submenu) => submenu?.some(item => location.pathname === item.path);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-xs text-gray-400 mt-1">Content Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isParentActive(item.submenu)
                        ? 'bg-orange-500 text-white'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {expandedMenus.includes(item.id) ? (
                      <FiChevronDown size={16} />
                    ) : (
                      <FiChevronRight size={16} />
                    )}
                  </button>
                  {expandedMenus.includes(item.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive(subItem.path)
                              ? 'bg-orange-500 text-white'
                              : 'hover:bg-gray-700 text-gray-400'
                          }`}
                        >
                          <subItem.icon size={16} />
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {menuItems
                .flatMap(item => item.submenu || [item])
                .find(item => item.path === location.pathname)?.title || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).email : 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
