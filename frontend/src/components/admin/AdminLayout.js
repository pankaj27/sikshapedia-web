import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from '../../components/CustomLink';
import { 
  FiHome, FiUsers, FiBook, FiFileText, FiAward, FiGrid, 
  FiLogOut, FiChevronDown, FiChevronRight, FiBookOpen, FiTag,
  FiSettings, FiDatabase, FiLink, FiDollarSign, FiMessageSquare, FiGlobe, FiShield, FiClock, FiStar, FiImage, FiPlus,
  FiTrendingUp, FiCreditCard, FiMail, FiCalendar
} from 'react-icons/fi';
import api from '../../api/axios';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(['content', 'tagging']);
  const [permissions, setPermissions] = useState(null);
  const [userRole, setUserRole] = useState('data_entry');

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/admin/permissions');
      setPermissions(response.data.permissions);
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const canAccess = (permission) => {
    if (!permissions) return true; // Show all while loading
    return permissions[permission] === true;
  };

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
      id: 'approvals',
      title: 'Pending Approvals',
      icon: FiClock,
      path: '/admin/pending-approvals',
      permission: 'manage_reviews',
      highlight: true
    },
    {
      id: 'leads',
      title: 'Lead Management',
      icon: FiUsers,
      submenu: [
        { title: 'All Leads', path: '/admin/leads', icon: FiUsers, highlight: true, badge: 'NEW' },
        { title: 'Lead Settings', path: '/admin/lead-settings', icon: FiSettings },
      ]
    },
    {
      id: 'communication',
      title: 'Communication',
      icon: FiMail,
      submenu: [
        { title: 'Newsletter Subscribers', path: '/admin/newsletter', icon: FiMail, highlight: true },
        { title: 'Email Settings & Templates', path: '/admin/email-settings', icon: FiSettings, highlight: true, badge: 'NEW' },
        { title: 'Footer Settings', path: '/admin/footer-settings', icon: FiSettings, highlight: true, badge: 'NEW' },
      ]
    },
    {
      id: 'admission',
      title: 'Admission Partners',
      icon: FiDollarSign,
      submenu: [
        { title: 'All Bookings', path: '/admin/admission-bookings', icon: FiFileText, highlight: true, badge: 'NEW' },
        { title: 'Partner Colleges', path: '/admin/admission-partners/colleges', icon: FiHome },
        { title: 'Partner Schools', path: '/admin/admission-partners/schools', icon: FiBookOpen },
        { title: 'Partner Universities', path: '/admin/admission-partners/universities', icon: FiAward },
      ]
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
        { title: 'Exam Listing Page', path: '/admin/exam-listing-settings', icon: FiSettings },
        { title: 'Course Listing Page', path: '/admin/course-listing-settings', icon: FiSettings },
        { title: 'News Listing Page', path: '/admin/news-listing-settings', icon: FiSettings },
        { title: 'Blog Listing Page', path: '/admin/blog-listing-settings', icon: FiSettings },
        { title: 'Course Pages (15)', path: '/admin/course-pages', icon: FiGrid },
        { title: 'News Articles', path: '/admin/news', icon: FiFileText },
        { title: 'Blogs', path: '/admin/blogs', icon: FiFileText },
        { title: 'Scholarships', path: '/admin/scholarships', icon: FiDollarSign },
        { title: 'Scholarships Page', path: '/admin/scholarships-listing-settings', icon: FiSettings },
        { title: 'Loans', path: '/admin/loans', icon: FiDollarSign },
        { title: 'Loans Page', path: '/admin/loans-listing-settings', icon: FiSettings },
        { title: 'Study Materials', path: '/admin/study-materials', icon: FiFileText },
        { title: 'Study Materials Page', path: '/admin/study-materials-listing-settings', icon: FiSettings },
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Elements',
      icon: FiGrid,
      submenu: [
        { title: 'Homepage Settings', path: '/admin/homepage-settings', icon: FiHome, highlight: true, badge: 'NEW' },
        { title: 'Write Review Settings', path: '/admin/write-review-settings', icon: FiStar, highlight: true, badge: 'NEW' },
        { title: 'Year Settings', path: '/admin/year-settings', icon: FiCalendar, highlight: true, badge: 'NEW' },
        { title: 'SEO Settings', path: '/admin/seo-settings', icon: FiGlobe, highlight: true, badge: 'NEW' },
        { title: 'Sponsored Ads', path: '/admin/sponsored-ads', icon: FiStar, highlight: true },
        { title: 'Ad Manager', path: '/admin/advertisements', icon: FiImage, highlight: true, badge: 'NEW' },
        { title: 'Banners & Sliders', path: '/admin/banners', icon: FiGrid },
        { title: 'Testimonials', path: '/admin/testimonials', icon: FiUsers },
        { title: 'FAQs', path: '/admin/faqs', icon: FiFileText },
        { title: 'Cities', path: '/admin/cities', icon: FiGrid },
        { title: 'Counselors', path: '/admin/counselors', icon: FiUsers, badge: 'NEW' },
        { title: 'Listing Pages', path: '/admin/listing-pages', icon: FiGlobe, highlight: true, badge: 'URLs' },
        { title: 'Static Pages', path: '/admin/static-pages', icon: FiFileText, badge: 'NEW' },
        { title: 'Advanced Content Builder', path: '/admin/advanced-content', icon: FiLayout, highlight: true, badge: 'P0' },
        { title: 'Study Abroad', path: '/admin/study-abroad', icon: FiGlobe, badge: 'NEW' },
        { title: 'Study Abroad Settings', path: '/admin/study-abroad-listing-settings', icon: FiSettings },
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
        { title: 'States & UTs', path: '/admin/states', icon: FiGlobe, highlight: true, badge: 'NEW' },
        { title: 'Cities', path: '/admin/cities', icon: FiGlobe, highlight: true, badge: 'NEW' },
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
        { title: 'Questions & Answers', path: '/admin/questions', icon: FiMessageSquare },
        { title: 'Comments', path: '/admin/comments', icon: FiMessageSquare },
        { title: 'Contact Inquiries', path: '/admin/contact-inquiries', icon: FiMessageSquare },
        { title: 'Lead Forms', path: '/admin/lead-forms', icon: FiMessageSquare, highlight: true, badge: 'NEW' },
        { title: 'Counseling Requests', path: '/admin/counseling-sessions', icon: FiMessageSquare },
      ]
    },
    {
      id: 'rewards',
      title: 'Rewards & Payments',
      icon: FiDollarSign,
      submenu: [
        { title: 'Dashboard', path: '/admin/rewards', icon: FiTrendingUp, badge: 'NEW' },
        { title: 'Pending Reviews', path: '/admin/rewards/pending-reviews', icon: FiMessageSquare },
        { title: 'Pending Answers', path: '/admin/rewards/pending-answers', icon: FiFileText },
        { title: 'Redemptions', path: '/admin/rewards/redemptions', icon: FiDollarSign },
        { title: 'Payment History', path: '/admin/rewards/payments', icon: FiCreditCard },
        { title: 'User Points Report', path: '/admin/rewards/users-report', icon: FiUsers },
      ]
    },
    {
      id: 'team',
      title: 'Team Management',
      icon: FiShield,
      path: '/admin/team',
      permission: 'manage_team'
    }
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (item.permission && !canAccess(item.permission)) return false;
    return true;
  }).map(item => {
    if (item.submenu) {
      return {
        ...item,
        submenu: item.submenu.filter(sub => !sub.permission || canAccess(sub.permission))
      };
    }
    return item;
  });

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

        {/* Role Badge */}
        {userRole && (
          <div className="px-4 py-2 border-b border-gray-700">
            <span className={`text-xs px-2 py-1 rounded ${
              userRole === 'super_admin' ? 'bg-purple-600 text-white' :
              userRole === 'content_manager' ? 'bg-blue-600 text-white' :
              'bg-green-600 text-white'
            }`}>
              {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredMenuItems.map((item) => (
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
        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            to="/admin/profile"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/profile'
                ? 'bg-orange-500 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <FiUsers size={18} />
            <span className="text-sm font-medium">My Profile</span>
          </Link>
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
