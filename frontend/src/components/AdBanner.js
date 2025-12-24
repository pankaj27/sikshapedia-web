import React, { useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * AdBanner Component
 * Displays advertisements on specified pages with automatic tracking
 * Ads are NOT closeable - they remain visible for the duration of the page visit
 * 
 * Usage:
 * <AdBanner pageName="home" position="top" />
 * <AdBanner pageName="college-detail" position="sidebar" />
 */
const AdBanner = ({ pageName, position = 'top' }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, [pageName]);

  const fetchAds = async () => {
    try {
      const response = await api.get(`/advertisements/active/${pageName}`);
      const activeAds = response.data.filter(ad => ad.position === position);
      setAds(activeAds);
      
      // Track impressions for all fetched ads
      activeAds.forEach(ad => {
        trackImpression(ad.id);
      });
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId) => {
    try {
      await api.post(`/advertisements/${adId}/impression`);
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async (adId) => {
    try {
      await api.post(`/advertisements/${adId}/click`);
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const handleAdClick = (ad) => {
    trackClick(ad.id);
    if (ad.link_url) {
      if (ad.open_in_new_tab) {
        window.open(ad.link_url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = ad.link_url;
      }
    }
  };

  if (loading || ads.length === 0) {
    return null;
  }

  return (
    <div className="ad-banner-container w-full">
      {ads.map(ad => (
        <div key={ad.id} className={`ad-banner ad-${ad.ad_type} ad-position-${ad.position}`}>
          
          {/* Banner Ad - Clean, Professional Design */}
          {ad.ad_type === 'banner' && (
            <div 
              className="w-full cursor-pointer group"
              onClick={() => handleAdClick(ad)}
            >
              <div className="relative overflow-hidden">
                {/* Background - Use image if available, else gradient */}
                {ad.image_url ? (
                  <div className="relative">
                    <img
                      src={ad.image_url}
                      alt={ad.title || 'Advertisement'}
                      className="w-full h-auto object-cover"
                      style={{ minHeight: '100px', maxHeight: '250px' }}
                    />
                    {/* Overlay with gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
                      <div className="relative flex items-center h-full px-4 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
                          <div className="text-left">
                            <h3 className="text-white font-bold text-base sm:text-lg drop-shadow-lg">
                              {ad.title || 'Special Offer'}
                            </h3>
                            {ad.description && (
                              <p className="text-white/90 text-xs sm:text-sm mt-0.5 drop-shadow">{ad.description}</p>
                            )}
                          </div>
                          {ad.link_url && (
                            <span className="inline-flex items-center px-4 py-1.5 sm:py-2 bg-white text-blue-700 font-semibold text-xs sm:text-sm rounded-full shadow-lg group-hover:bg-blue-50 transition-colors whitespace-nowrap">
                              Learn More
                              <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Sponsored label */}
                    <div className="absolute top-1 right-2 text-[10px] text-white/80 font-medium bg-black/30 px-1.5 py-0.5 rounded">Ad</div>
                  </div>
                ) : (
                  /* Fallback gradient background when no image */
                  <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }} />
                    </div>
                    
                    <div className="relative flex items-center justify-center px-4 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                        <div className="text-center sm:text-left">
                          <h3 className="text-white font-bold text-base sm:text-lg">
                            {ad.title || 'Special Offer'}
                          </h3>
                          {ad.description && (
                            <p className="text-blue-100 text-xs sm:text-sm mt-0.5">{ad.description}</p>
                          )}
                        </div>
                        {ad.link_url && (
                          <span className="inline-flex items-center px-4 py-1.5 sm:py-2 bg-white text-blue-700 font-semibold text-xs sm:text-sm rounded-full shadow-lg group-hover:bg-blue-50 transition-colors whitespace-nowrap">
                            Learn More
                            <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Sponsored label */}
                    <div className="absolute top-1 right-2 text-[10px] text-white/60 font-medium">Ad</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Popup Ad - Full overlay with content */}
          {ad.ad_type === 'popup' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div 
                className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-transform"
                onClick={() => handleAdClick(ad)}
              >
                {ad.image_url && (
                  <img
                    src={ad.image_url}
                    alt={ad.title || 'Advertisement'}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded mb-3">Sponsored</span>
                  <h3 className="text-xl font-bold text-gray-900">{ad.title}</h3>
                  {ad.description && (
                    <p className="mt-2 text-gray-600 text-sm">{ad.description}</p>
                  )}
                  {ad.link_url && (
                    <button className="mt-4 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      Learn More
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Ad - Compact vertical format */}
          {ad.ad_type === 'sidebar' && (
            <div 
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleAdClick(ad)}
            >
              <div className="relative">
                {ad.image_url ? (
                  <img
                    src={ad.image_url}
                    alt={ad.title || 'Advertisement'}
                    className="w-full h-auto object-cover"
                    style={{ minHeight: '120px', maxHeight: '200px' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/80">{ad.title?.charAt(0) || 'A'}</span>
                  </div>
                )}
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 text-white text-[10px] font-medium rounded">Ad</span>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{ad.title}</h4>
                {ad.description && (
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{ad.description}</p>
                )}
                {ad.link_url && (
                  <span className="inline-block mt-3 text-blue-600 text-xs font-medium hover:text-blue-800">
                    Learn More →
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Floating Ad - Fixed position bottom corner */}
          {ad.ad_type === 'floating' && (
            <div className="fixed bottom-6 right-6 z-40 max-w-xs animate-bounce-slow">
              <div 
                className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-200 cursor-pointer hover:shadow-3xl transition-all"
                onClick={() => handleAdClick(ad)}
              >
                <div className="relative bg-gradient-to-br from-orange-500 to-pink-500 p-4">
                  <span className="absolute top-2 right-2 text-[10px] text-white/80 font-medium">Ad</span>
                  {ad.image_url && (
                    <img
                      src={ad.image_url}
                      alt={ad.title || 'Advertisement'}
                      className="w-16 h-16 object-contain mx-auto"
                    />
                  )}
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-gray-900 text-sm">{ad.title}</h4>
                  {ad.description && (
                    <p className="text-gray-500 text-xs mt-1">{ad.description}</p>
                  )}
                  {ad.link_url && (
                    <span className="inline-block mt-2 px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      Click Here
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HTML/Native Ad - Raw HTML content with wrapper */}
          {ad.ad_type === 'html' && (
            <div 
              className="relative bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 cursor-pointer"
              onClick={() => handleAdClick(ad)}
            >
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded z-10">Ad</span>
              <div
                className="ad-html-content"
                dangerouslySetInnerHTML={{ __html: ad.html_content || '' }}
              />
            </div>
          )}

          {/* Text Ad - Clean inline sponsored content */}
          {ad.ad_type === 'text' && (
            <div 
              className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl px-5 py-4 border border-slate-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
              onClick={() => handleAdClick(ad)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">Sponsored</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{ad.title}</h4>
                  {ad.description && (
                    <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">{ad.description}</p>
                  )}
                </div>
                {ad.link_url && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      Visit
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Ad - Embedded video player */}
          {ad.ad_type === 'video' && (
            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg">
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded z-10">Ad</span>
              <div className="aspect-video">
                {ad.video_url ? (
                  <iframe
                    src={ad.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={ad.title || 'Video Advertisement'}
                  />
                ) : ad.video_thumbnail ? (
                  <div
                    className="relative cursor-pointer group"
                    onClick={() => handleAdClick(ad)}
                  >
                    <img src={ad.video_thumbnail} alt={ad.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <svg className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              {ad.title && (
                <div 
                  className="p-4 bg-gray-800 cursor-pointer"
                  onClick={() => handleAdClick(ad)}
                >
                  <h4 className="font-semibold text-white text-sm">{ad.title}</h4>
                  {ad.description && (
                    <p className="text-gray-400 text-xs mt-1">{ad.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdBanner;
