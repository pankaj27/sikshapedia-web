import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const SEOSection = ({ value, onChange }) => {
  const [expanded, setExpanded] = useState(true);
  const [seoData, setSeoData] = useState(value || {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    noIndex: false,
    noFollow: false,
    structuredData: '',
  });

  const handleChange = (field, fieldValue) => {
    const newData = { ...seoData, [field]: fieldValue };
    setSeoData(newData);
    onChange(newData);
  };

  const titleLength = seoData.metaTitle?.length || 0;
  const descLength = seoData.metaDescription?.length || 0;

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <span className="font-semibold text-gray-800">SEO Settings</span>
        </div>
        {expanded ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6 border-t">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
              <span className={`ml-2 text-xs ${titleLength > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                ({titleLength}/60)
              </span>
            </label>
            <input
              type="text"
              value={seoData.metaTitle}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                titleLength > 60 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Page title for search engines"
            />
            {titleLength > 60 && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> Title is too long. Recommended: 50-60 characters
              </p>
            )}
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
              <span className={`ml-2 text-xs ${descLength > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                ({descLength}/160)
              </span>
            </label>
            <textarea
              value={seoData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                descLength > 160 ? 'border-red-300' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="Brief description for search results"
            />
            {descLength > 160 && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> Description is too long. Recommended: 150-160 characters
              </p>
            )}
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
            <input
              type="text"
              value={seoData.metaKeywords}
              onChange={(e) => handleChange('metaKeywords', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>

          {/* Open Graph */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-800 mb-3">Open Graph (Social Media)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  type="text"
                  value={seoData.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Title for social sharing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  type="text"
                  value={seoData.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
              <textarea
                value={seoData.ogDescription}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Description for social sharing"
              />
            </div>
          </div>

          {/* Advanced */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-800 mb-3">Advanced Settings</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
              <input
                type="text"
                value={seoData.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/canonical-page"
              />
            </div>
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.noIndex}
                  onChange={(e) => handleChange('noIndex', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">No Index (hide from search)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.noFollow}
                  onChange={(e) => handleChange('noFollow', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">No Follow (don't follow links)</span>
              </label>
            </div>
          </div>

          {/* Structured Data */}
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-1">Structured Data (JSON-LD)</label>
            <textarea
              value={seoData.structuredData}
              onChange={(e) => handleChange('structuredData', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder='{"@context": "https://schema.org", ...}'
            />
          </div>

          {/* Preview */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-800 mb-3">Search Preview</h4>
            <div className="bg-white border rounded-lg p-4">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                {seoData.metaTitle || 'Page Title'}
              </div>
              <div className="text-green-700 text-sm truncate">
                {seoData.canonicalUrl || 'https://yoursite.com/page-url'}
              </div>
              <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                {seoData.metaDescription || 'Meta description will appear here...'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEOSection;
