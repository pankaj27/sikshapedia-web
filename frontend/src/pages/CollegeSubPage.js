import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiInfo, FiBook, FiFileText, FiBarChart2, FiBriefcase, FiAward, FiDollarSign, FiMessageSquare, FiBookmark, FiImage, FiUsers, FiCalendar, FiMapPin, FiHelpCircle, FiPhone } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineOfficeBuilding, HiOutlineCurrencyRupee, HiOutlineLibrary } from 'react-icons/hi';
import api from '../api/axios';

// Icon mapping for professional icons
const iconMap = {
  'info': <FiInfo size={16} />,
  'courses': <FiBook size={16} />,
  'admission': <FiFileText size={16} />,
  'cutoff': <FiBarChart2 size={16} />,
  'placement': <FiBriefcase size={16} />,
  'ranking': <FiAward size={16} />,
  'scholarship': <HiOutlineCurrencyRupee size={16} />,
  'facilities': <HiOutlineOfficeBuilding size={16} />,
  'reviews': <FiMessageSquare size={16} />,
  'overview': <FiHome size={16} />,
  'programs': <HiOutlineAcademicCap size={16} />,
  'fees': <FiDollarSign size={16} />,
  'campus': <HiOutlineLibrary size={16} />,
  'gallery': <FiImage size={16} />,
  'faculty': <FiUsers size={16} />,
  'events': <FiCalendar size={16} />,
  'location': <FiMapPin size={16} />,
  'faq': <FiHelpCircle size={16} />,
  'default': <FiBookmark size={16} />,
};

// Icon mapping for larger icons (headers)
const iconMapLarge = {
  'info': <FiInfo size={28} />,
  'courses': <FiBook size={28} />,
  'admission': <FiFileText size={28} />,
  'cutoff': <FiBarChart2 size={28} />,
  'placement': <FiBriefcase size={28} />,
  'ranking': <FiAward size={28} />,
  'scholarship': <HiOutlineCurrencyRupee size={28} />,
  'facilities': <HiOutlineOfficeBuilding size={28} />,
  'reviews': <FiMessageSquare size={28} />,
  'overview': <FiHome size={28} />,
  'programs': <HiOutlineAcademicCap size={28} />,
  'fees': <FiDollarSign size={28} />,
  'campus': <HiOutlineLibrary size={28} />,
  'gallery': <FiImage size={28} />,
  'faculty': <FiUsers size={28} />,
  'events': <FiCalendar size={28} />,
  'location': <FiMapPin size={28} />,
  'faq': <FiHelpCircle size={28} />,
  'default': <FiBookmark size={28} />,
};

// Helper function to get icon component
const getMenuIcon = (iconId) => iconMap[iconId] || iconMap['default'];
const getMenuIconLarge = (iconId) => iconMapLarge[iconId] || iconMapLarge['default'];

const CollegeSubPage = () => {
  const { id, section } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await api.get(`/colleges/${id}`);
        setCollege(response.data);
        
        // Find the current section from menu_config
        if (response.data.menu_config?.use_custom_menu) {
          const menuItems = response.data.menu_config.items || [];
          const found = menuItems.find(item => item.id === section);
          setCurrentSection(found);
        }
      } catch (error) {
        console.error('Error fetching college:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id, section]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">College not found</h1>
          <Link to="/colleges" className="text-orange-600 hover:underline mt-4 block">
            Back to Colleges
          </Link>
        </div>
      </div>
    );
  }

  // Get menu items
  const menuItems = college.menu_config?.use_custom_menu 
    ? (college.menu_config.items || []).filter(item => item.enabled).sort((a, b) => a.order - b.order)
    : [];

  return (
    <>
      <Helmet>
        <title>{currentSection?.label || section} - {college.name} | Admissionbuddy</title>
        <meta name="description" content={`${currentSection?.label || section} information for ${college.name}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header with College Info */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4">
              {college.logo_url && (
                <img 
                  src={college.logo_url.startsWith('/api') ? college.logo_url : `/api${college.logo_url}`}
                  alt={college.name}
                  className="w-16 h-16 rounded-lg bg-white p-1 object-contain"
                />
              )}
              <div>
                <Link to={`/colleges/${id}`} className="hover:underline">
                  <h1 className="text-2xl font-bold">{college.name}</h1>
                </Link>
                <p className="text-orange-100">{college.location?.city}, {college.location?.state}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2">
              {/* Main Page Link */}
              <Link
                to={`/colleges/${id}`}
                className="px-4 py-2 rounded-lg text-sm whitespace-nowrap bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
              >
                <FiHome size={14} /> Main
              </Link>
              
              {/* Menu Items */}
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={`/colleges/${id}/${item.id}`}
                  className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
                    section === item.id 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getMenuIcon(item.id)} {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {currentSection ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <span className="text-orange-500">{getMenuIconLarge(currentSection.id)}</span>
                    {currentSection.label}
                  </h2>
                  
                  {currentSection.content ? (
                    <div 
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: currentSection.content.replace(/\n/g, '<br/>') }}
                    />
                  ) : (
                    <p className="text-gray-500 italic">No content available for this section.</p>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Section Not Found</h2>
                  <p className="text-gray-600 mb-6">The requested section "{section}" does not exist.</p>
                  <Link 
                    to={`/colleges/${id}`}
                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
                  >
                    <FiHome size={16} /> Back to {college.name}
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Navigation */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiBookmark className="text-orange-500" size={18} /> Quick Navigation
                </h3>
                <div className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={`/colleges/${id}/${item.id}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        section === item.id
                          ? 'bg-orange-100 text-orange-700 font-semibold'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className={section === item.id ? 'text-orange-600' : 'text-gray-400'}>{getMenuIcon(item.id)}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* College Quick Facts */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HiOutlineOfficeBuilding className="text-orange-500" size={18} /> Quick Facts
                </h3>
                <div className="space-y-3 text-sm">
                  {college.established && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Established</span>
                      <span className="font-semibold">{college.established}</span>
                    </div>
                  )}
                  {college.institution_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-semibold">{college.institution_type}</span>
                    </div>
                  )}
                  {college.ownership && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ownership</span>
                      <span className="font-semibold">{college.ownership}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <FiHelpCircle size={18} /> Need Help?
                </h3>
                <p className="text-sm text-orange-100 mb-4">Get free counseling from our experts</p>
                <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-50 flex items-center justify-center gap-2">
                  <FiPhone size={16} /> Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollegeSubPage;
