import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiStar, FiCheckCircle, FiMapPin, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';
import { getInstitutionDetailUrl } from '../utils/urlHelpers';

// Sidebar Ad Component - For detail pages
export const SidebarSponsoredAd = ({ placementId, title = "Sponsored" }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get(`/sponsored-ads-multi/${placementId}?limit=3`);
        setAds(response.data || []);
      } catch (error) {
        console.error('Error fetching sidebar ads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [placementId]);

  if (loading || ads.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">{title}</span>
        <span className="text-xs bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded font-bold">AD</span>
      </div>
      <div className="p-3 space-y-3">
        {ads.map((ad, idx) => (
          <Link
            key={ad.id || idx}
            to={getInstitutionDetailUrl(ad.institution_type || 'college', ad.id, ad.name, ad.location?.city, ad.serial_number)}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {ad.logo_url ? (
                <img src={ad.logo_url} alt={ad.name} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="text-lg font-bold text-blue-600">{ad.name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {ad.name}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <FiMapPin size={10} />
                {ad.location?.city}, {ad.location?.state}
              </p>
              {ad.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <FiStar size={10} className="text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{ad.rating?.toFixed(1)}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Featured Section Component - For listing pages
export const FeaturedSponsoredSection = ({ 
  placementId, 
  title = "Featured Colleges", 
  subtitle = "Sponsored recommendations",
  bgColor = "from-orange-50 via-amber-50 to-yellow-50",
  headerColor = "from-orange-500 to-amber-500",
  linkColor = "text-orange-600",
  viewAllLink = "/india-colleges"
}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get(`/sponsored-ads-multi/${placementId}?limit=6`);
        setAds(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching featured ads:', error);
        setAds([]); // Ensure ads is always an array on error
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [placementId]);

  if (loading || !Array.isArray(ads) || ads.length === 0) return null;

  return (
    <div className={`bg-gradient-to-r ${bgColor} rounded-xl border-2 border-orange-200 overflow-hidden shadow-lg my-4`}>
      <div className={`bg-gradient-to-r ${headerColor} px-4 py-2 flex items-center gap-2`}>
        <FiStar className="text-white fill-current" size={14} />
        <span className="text-white font-bold text-sm">{title}</span>
        <span className="text-white/70 text-xs ml-auto">Sponsored</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(ads || []).slice(0, 3).map((ad, idx) => (
            <Link
              key={ad.id || idx}
              to={getInstitutionDetailUrl(ad.institution_type || 'college', ad.id, ad.name, ad.location?.city, ad.serial_number)}
              className={`bg-white rounded-lg p-4 border border-orange-100 hover:shadow-md hover:border-orange-300 transition-all ${idx === 2 ? 'hidden md:block' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                  idx === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                  idx === 1 ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                  'bg-gradient-to-br from-emerald-100 to-emerald-200'
                }`}>
                  {ad.logo_url ? (
                    <img src={ad.logo_url} alt={ad.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className={`text-lg font-bold ${
                      idx === 0 ? 'text-blue-600' : idx === 1 ? 'text-purple-600' : 'text-emerald-600'
                    }`}>{ad.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{ad.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {ad.location?.city}{ad.location?.state ? `, ${ad.location.state}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {ad.type && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        ad.type === 'Government' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>{ad.type}</span>
                    )}
                    {ad.nirf_ranking && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">NIRF #{ad.nirf_ranking}</span>
                    )}
                    {ad.rating > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center gap-0.5">
                        <FiStar size={10} className="fill-current" /> {ad.rating?.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs ${linkColor} font-medium mt-2 inline-block`}>Apply Now →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to={viewAllLink} className={`text-sm ${linkColor} hover:underline font-medium inline-flex items-center gap-1`}>
            View All {title} <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Admissions Open Section Component
export const AdmissionsOpenSection = ({ 
  placementId,
  viewAllLink = "/india-colleges"
}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get(`/sponsored-ads-multi/${placementId}?limit=6`);
        setAds(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching admission ads:', error);
        setAds([]); // Ensure ads is always an array on error
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [placementId]);

  if (loading || !Array.isArray(ads) || ads.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl border-2 border-green-200 overflow-hidden shadow-lg my-4">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 flex items-center gap-2">
        <FiCheckCircle className="text-white" size={14} />
        <span className="text-white font-bold text-sm">Admissions Open 2025</span>
        <span className="text-green-100 text-xs ml-auto">Apply Now</span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(ads || []).slice(0, 3).map((ad, idx) => (
            <Link
              key={ad.id || idx}
              to={getInstitutionDetailUrl(ad.institution_type || 'college', ad.id, ad.name, ad.location?.city, ad.serial_number)}
              className={`bg-white rounded-lg p-4 border border-green-100 hover:shadow-md hover:border-green-300 transition-all ${idx === 2 ? 'hidden md:block' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                  idx === 0 ? 'bg-gradient-to-br from-green-100 to-green-200' :
                  idx === 1 ? 'bg-gradient-to-br from-teal-100 to-teal-200' :
                  'bg-gradient-to-br from-emerald-100 to-emerald-200'
                }`}>
                  {ad.logo_url ? (
                    <img src={ad.logo_url} alt={ad.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className={`text-lg font-bold ${
                      idx === 0 ? 'text-green-600' : idx === 1 ? 'text-teal-600' : 'text-emerald-600'
                    }`}>{ad.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{ad.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {ad.location?.city}{ad.location?.state ? `, ${ad.location.state}` : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                      Admissions Open
                    </span>
                    {ad.average_fees > 0 && (
                      <span className="text-xs text-gray-600">
                        ₹{ad.average_fees >= 100000 ? `${(ad.average_fees / 100000).toFixed(1)}L` : `${(ad.average_fees / 1000).toFixed(0)}K`}/yr
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-green-600 font-medium mt-2 inline-block">Apply Now →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to={viewAllLink} className="text-sm text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1">
            View All Colleges with Open Admissions <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

// URL-Aware Sponsored Section - Automatically uses URL-specific ads with fallback
export const UrlAwareSponsoredSection = ({ 
  sectionType = 'featured', // 'featured', 'admission', 'sponsored'
  title,
  subtitle,
  bgColor,
  headerColor,
  viewAllLink = "/india-colleges"
}) => {
  const location = useLocation();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default styles based on section type
  const defaultStyles = {
    featured: {
      title: 'Featured Colleges',
      subtitle: 'Sponsored recommendations',
      bgColor: 'from-orange-50 via-amber-50 to-yellow-50',
      headerColor: 'from-orange-500 to-amber-500',
      icon: FiStar
    },
    admission: {
      title: 'Admissions Open 2025',
      subtitle: 'Apply now for upcoming session',
      bgColor: 'from-green-50 via-emerald-50 to-teal-50',
      headerColor: 'from-green-600 to-emerald-600',
      icon: FiCheckCircle
    },
    sponsored: {
      title: 'Sponsored Colleges',
      subtitle: 'Featured partners',
      bgColor: 'from-blue-50 via-indigo-50 to-purple-50',
      headerColor: 'from-blue-600 to-indigo-600',
      icon: FiStar
    }
  };

  const styles = defaultStyles[sectionType] || defaultStyles.featured;
  const Icon = styles.icon;

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // Get current URL path without leading slash
        const urlPath = location.pathname.replace(/^\//, '') + location.search;
        const response = await api.get(`/sponsored-ads-by-url?url=${encodeURIComponent(urlPath)}&section_type=${sectionType}`);
        setAds(response.data || []);
      } catch (error) {
        console.error('Error fetching URL-specific ads:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [location.pathname, location.search, sectionType]);

  if (loading || !ads || ads.length === 0) return null;

  return (
    <div className={`bg-gradient-to-r ${bgColor || styles.bgColor} rounded-xl border-2 border-orange-200 overflow-hidden shadow-lg my-4`}>
      <div className={`bg-gradient-to-r ${headerColor || styles.headerColor} px-4 py-2 flex items-center gap-2`}>
        <Icon className="text-white fill-current" size={14} />
        <span className="text-white font-bold text-sm">{title || styles.title}</span>
        <span className="text-white/70 text-xs ml-auto">Sponsored</span>
      </div>
      <div className="p-4">
        {subtitle && <p className="text-gray-600 text-sm mb-3">{subtitle || styles.subtitle}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(ads || []).slice(0, 3).map((ad, idx) => (
            <Link
              key={ad.id || idx}
              to={getInstitutionDetailUrl(ad.institution_type || 'college', ad.id, ad.name, ad.location?.city, ad.serial_number)}
              className={`bg-white rounded-lg p-4 border border-orange-100 hover:shadow-md hover:border-orange-300 transition-all ${idx === 2 ? 'hidden md:block' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                  idx === 0 ? 'bg-gradient-to-br from-orange-100 to-orange-200' :
                  idx === 1 ? 'bg-gradient-to-br from-amber-100 to-amber-200' :
                  'bg-gradient-to-br from-yellow-100 to-yellow-200'
                }`}>
                  {ad.logo_url ? (
                    <img src={ad.logo_url} alt={ad.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-lg font-bold text-orange-600">{ad.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors">
                    {ad.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <FiMapPin size={10} />
                    <span className="truncate">{ad.location?.city}, {ad.location?.state}</span>
                  </div>
                  {ad.rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <FiStar className="text-yellow-500 fill-current" size={12} />
                      <span className="text-xs font-medium text-gray-700">{ad.rating?.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to={viewAllLink} className="text-sm text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default { SidebarSponsoredAd, FeaturedSponsoredSection, AdmissionsOpenSection, UrlAwareSponsoredSection };
