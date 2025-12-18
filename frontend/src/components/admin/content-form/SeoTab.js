import React from 'react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';

/**
 * SeoTab - Reusable SEO tab for News/Blog forms
 */
const SeoTab = ({
  formData,
  setFormData,
  keywordInput,
  setKeywordInput,
  entityType = 'article' // 'article', 'news', 'blog'
}) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !(formData.meta_keywords || []).includes(keywordInput.trim())) {
      handleChange('meta_keywords', [...(formData.meta_keywords || []), keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    handleChange('meta_keywords', (formData.meta_keywords || []).filter(k => k !== keyword));
  };

  const autoGenerateSeo = () => {
    const year = new Date().getFullYear();
    setFormData(prev => ({
      ...prev,
      meta_title: `${prev.title} | ${prev.category} ${year} - Admissionbuddy`.substring(0, 60),
      meta_description: `${prev.summary || prev.title}. Get latest updates on ${prev.category?.toLowerCase() || entityType} from Admissionbuddy.`.substring(0, 160)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FiSearch className="text-purple-500" /> SEO Settings
          </h3>
          <button
            type="button"
            onClick={autoGenerateSeo}
            className="text-sm text-purple-600 hover:underline"
          >
            ⚡ Auto-generate SEO
          </button>
        </div>

        <div className="space-y-4">
          {/* Meta Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Meta Title</label>
              <span className={`text-xs ${(formData.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.meta_title?.length || 0}/60
              </span>
            </div>
            <input
              type="text"
              value={formData.meta_title || ''}
              onChange={(e) => handleChange('meta_title', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="SEO title for search results"
              maxLength={70}
            />
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Meta Description</label>
              <span className={`text-xs ${(formData.meta_description?.length || 0) > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.meta_description?.length || 0}/160
              </span>
            </div>
            <textarea
              value={formData.meta_description || ''}
              onChange={(e) => handleChange('meta_description', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              rows="3"
              placeholder="SEO description for search results"
              maxLength={170}
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block text-sm font-medium mb-1">Meta Keywords</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1 border rounded-lg px-4 py-2"
                placeholder="Add keyword"
              />
              <button type="button" onClick={addKeyword} className="px-4 py-2 bg-gray-100 rounded-lg">
                <FiPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.meta_keywords || []).map((kw, i) => (
                <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  {kw}
                  <button type="button" onClick={() => removeKeyword(kw)}>
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Canonical URL */}
          <div>
            <label className="block text-sm font-medium mb-1">Canonical URL</label>
            <input
              type="url"
              value={formData.canonical_url || ''}
              onChange={(e) => handleChange('canonical_url', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Leave empty to auto-generate"
            />
          </div>

          {/* OG Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Social Share Image (OG Image)</label>
            <input
              type="url"
              value={formData.og_image || ''}
              onChange={(e) => handleChange('og_image', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="https://example.com/og-image.jpg"
            />
            <button
              type="button"
              onClick={() => handleChange('og_image', formData.featured_image || formData.image)}
              className="text-xs text-purple-600 hover:underline mt-1"
            >
              ⚡ Use featured image
            </button>
          </div>

          {/* Schema Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Schema Type</label>
            <select
              value={formData.schema_type || 'NewsArticle'}
              onChange={(e) => handleChange('schema_type', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="NewsArticle">NewsArticle</option>
              <option value="Article">Article</option>
              <option value="BlogPosting">BlogPosting</option>
            </select>
          </div>

          {/* Preview */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-3">👁️ Search Result Preview</h4>
            <div className="bg-white border rounded-lg p-4 max-w-xl">
              <div className="text-blue-600 text-lg hover:underline truncate">
                {formData.meta_title || formData.title || 'Page Title'}
              </div>
              <div className="text-green-700 text-sm">
                admissionbuddy.co › {entityType} › {formData.slug || 'article-slug'}
              </div>
              <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                {formData.meta_description || formData.summary || 'Meta description preview'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoTab;
