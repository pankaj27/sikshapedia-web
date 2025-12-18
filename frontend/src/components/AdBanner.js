import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../api/axios';

/**
 * AdBanner Component
 * Displays advertisements on specified pages with automatic tracking
 * 
 * Usage:
 * <AdBanner pageName="home" position="top" />
 * <AdBanner pageName="college-detail" position="sidebar" />
 */
const AdBanner = ({ pageName, position = 'top' }) => {
  const [ads, setAds] = useState([]);
  const [closedAds, setClosedAds] = useState(new Set());
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
    if (ad.open_in_new_tab) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = ad.link_url;
    }
  };

  const handleClose = (adId) => {
    setClosedAds(prev => new Set([...prev, adId]));
  };

  if (loading || ads.length === 0) {
    return null;
  }

  // Filter out closed ads
  const visibleAds = ads.filter(ad => !closedAds.has(ad.id));

  if (visibleAds.length === 0) {
    return null;
  }

  return (
    <div className="ad-banner-container">
      {visibleAds.map(ad => (
        <div key={ad.id} className={`ad-banner ad-${ad.ad_type} ad-position-${ad.position} mb-4`}>
          {/* Banner Ad */}
          {ad.ad_type === 'banner' && (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => handleClose(ad.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
                aria-label="Close ad"
              >
                <FiX className="w-4 h-4 text-gray-600" />
              </button>
              <div
                className="cursor-pointer"
                onClick={() => handleAdClick(ad)}
              >
                <img
                  src={ad.image_url}
                  alt={ad.title || 'Advertisement'}
                  className="w-full h-auto max-h-32 object-cover"
                />
                {ad.title && (
                  <div className="p-2 bg-white">
                    <p className="text-sm font-medium text-gray-800">{ad.title}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Popup Ad */}
          {ad.ad_type === 'popup' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="relative bg-white rounded-lg max-w-2xl w-full shadow-xl">
                <button
                  onClick={() => handleClose(ad.id)}
                  className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 z-10"
                  aria-label="Close ad"
                >
                  <FiX className="w-5 h-5" />
                </button>
                <div
                  className="cursor-pointer p-4"
                  onClick={() => handleAdClick(ad)}
                >
                  <img
                    src={ad.image_url}
                    alt={ad.title || 'Advertisement'}
                    className="w-full h-auto max-h-96 object-contain rounded"
                  />
                  {ad.title && (
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-gray-900">{ad.title}</h3>
                      {ad.description && (
                        <p className="mt-2 text-gray-600">{ad.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Ad */}
          {ad.ad_type === 'sidebar' && (
            <div className="relative bg-white rounded-lg overflow-hidden shadow-md border">
              <button
                onClick={() => handleClose(ad.id)}
                className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 z-10"
                aria-label="Close ad"
              >
                <FiX className="w-3 h-3" />
              </button>
              <div
                className="cursor-pointer"
                onClick={() => handleAdClick(ad)}
              >
                <img
                  src={ad.image_url}
                  alt={ad.title || 'Advertisement'}
                  className="w-full h-auto"
                />
                {ad.title && (
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-800">{ad.title}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Floating Ad */}
          {ad.ad_type === 'floating' && (
            <div className="fixed bottom-4 right-4 z-40 max-w-sm">
              <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl border">
                <button
                  onClick={() => handleClose(ad.id)}
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-700 z-10"
                  aria-label="Close ad"
                >
                  <FiX className="w-4 h-4" />
                </button>
                <div
                  className="cursor-pointer"
                  onClick={() => handleAdClick(ad)}
                >
                  <img
                    src={ad.image_url}
                    alt={ad.title || 'Advertisement'}
                    className="w-full h-auto"
                  />
                  {ad.title && (
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-800">{ad.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HTML/Native Ad */}
          {ad.ad_type === 'html' && (
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border">
              <button
                onClick={() => handleClose(ad.id)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-md hover:bg-gray-100 z-10"
                aria-label="Close ad"
              >
                <FiX className="w-4 h-4 text-gray-600" />
              </button>
              <div
                className="cursor-pointer"
                onClick={() => handleAdClick(ad)}
                dangerouslySetInnerHTML={{ __html: ad.html_content || '' }}
              />
            </div>
          )}

          {/* Text Ad */}
          {ad.ad_type === 'text' && (
            <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 shadow-sm">
              <button
                onClick={() => handleClose(ad.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Close ad"
              >
                <FiX className="w-4 h-4" />
              </button>
              <div
                className="cursor-pointer"
                onClick={() => handleAdClick(ad)}
              >
                <span className="text-xs text-blue-600 font-medium">Sponsored</span>
                <h4 className="font-semibold text-gray-900 mt-1">{ad.title}</h4>
                {ad.description && (
                  <p className="text-sm text-gray-600 mt-1">{ad.description}</p>
                )}
                <span className="text-xs text-blue-600 mt-2 inline-block">Learn More →</span>
              </div>
            </div>
          )}

          {/* Video Ad */}
          {ad.ad_type === 'video' && (
            <div className="relative bg-black rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => handleClose(ad.id)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow-md hover:bg-white z-10"
                aria-label="Close ad"
              >
                <FiX className="w-4 h-4 text-gray-600" />
              </button>
              <div className="aspect-video">
                {ad.video_url ? (
                  <iframe
                    src={ad.video_url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : ad.video_thumbnail ? (
                  <div
                    className="relative cursor-pointer"
                    onClick={() => handleAdClick(ad)}
                  >
                    <img src={ad.video_thumbnail} alt={ad.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <span className="text-2xl">▶</span>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              {ad.title && (
                <div className="p-3 bg-white">
                  <p className="text-sm font-medium text-gray-800">{ad.title}</p>
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
