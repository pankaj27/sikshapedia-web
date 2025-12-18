import React from 'react';
import { FiInfo } from 'react-icons/fi';

/**
 * SEO Meta Tags Section Component
 * Reusable component for managing SEO meta tags across different admin forms
 */
const SeoMetaSection = ({ formData, setFormData, handleChange, entityType = 'college' }) => {
  const currentYear = new Date().getFullYear();

  const autoGenerateMetaTitle = () => {
    const city = formData.location?.city || '';
    const title = `${formData.name}${city ? ` - ${city}` : ''} | Admission, Fees, Ranking - Admissionbuddy`;
    setFormData({ ...formData, meta_title: title.substring(0, 60) });
  };

  const autoGenerateMetaDescription = () => {
    const desc = `Get complete details on ${formData.name} admission ${currentYear}, fee structure, courses offered, placements, ranking & cutoff. Apply now through Admissionbuddy.`;
    setFormData({ ...formData, meta_description: desc.substring(0, 160) });
  };

  const autoGenerateKeywords = () => {
    const keywords = [
      formData.name,
      formData.location?.city,
      formData.type,
      `admission ${currentYear}`,
      'fees',
      'ranking',
      'courses',
      'placement'
    ].filter(Boolean).join(', ');
    setFormData({ ...formData, meta_keywords: keywords });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Configure meta tags for search engines and social media sharing. These improve search visibility and click-through rates.
      </p>

      {/* Meta Title */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Meta Title</label>
          <span className={`text-xs ${(formData.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
            {formData.meta_title?.length || 0}/60 characters
          </span>
        </div>
        <input
          type="text"
          name="meta_title"
          value={formData.meta_title || ''}
          onChange={handleChange}
          placeholder="e.g., IIT Bombay - Admission 2025, Fees, Ranking | Admissionbuddy"
          className={`w-full border-2 rounded px-3 py-2 ${(formData.meta_title?.length || 0) > 60 ? 'border-red-300' : 'border-gray-200'}`}
          maxLength={70}
        />
        <p className="text-xs text-gray-500 mt-1">Appears in browser tab and search results. Keep under 60 characters for best display.</p>
        <button type="button" onClick={autoGenerateMetaTitle} className="text-xs text-blue-600 hover:underline mt-1">
          ⚡ Auto-generate from name
        </button>
      </div>

      {/* Meta Description */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Meta Description</label>
          <span className={`text-xs ${(formData.meta_description?.length || 0) > 160 ? 'text-red-500' : (formData.meta_description?.length || 0) > 150 ? 'text-yellow-500' : 'text-gray-500'}`}>
            {formData.meta_description?.length || 0}/160 characters
          </span>
        </div>
        <textarea
          name="meta_description"
          value={formData.meta_description || ''}
          onChange={handleChange}
          placeholder="e.g., Get complete details on IIT Bombay admission 2025, fee structure, courses, placements, ranking, and cutoff."
          rows="3"
          className={`w-full border-2 rounded px-3 py-2 ${(formData.meta_description?.length || 0) > 160 ? 'border-red-300' : 'border-gray-200'}`}
          maxLength={170}
        />
        <p className="text-xs text-gray-500 mt-1">Search result snippet. Keep between 150-160 characters for optimal display.</p>
        <button type="button" onClick={autoGenerateMetaDescription} className="text-xs text-blue-600 hover:underline mt-1">
          ⚡ Auto-generate description
        </button>
      </div>

      {/* Meta Keywords */}
      <div>
        <label className="block text-sm font-medium mb-1">Meta Keywords</label>
        <input
          type="text"
          name="meta_keywords"
          value={formData.meta_keywords || ''}
          onChange={handleChange}
          placeholder="e.g., IIT Bombay, engineering college, admission 2025, fees, ranking, placement"
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Comma-separated keywords relevant to this institution.</p>
        <button type="button" onClick={autoGenerateKeywords} className="text-xs text-blue-600 hover:underline mt-1">
          ⚡ Auto-generate keywords
        </button>
      </div>

      {/* Social Media Section */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📱 Open Graph (Social Media)</h3>
      </div>

      {/* OG Title */}
      <div>
        <label className="block text-sm font-medium mb-1">OG Title (Social Share Title)</label>
        <input
          type="text"
          name="og_title"
          value={formData.og_title || ''}
          onChange={handleChange}
          placeholder="Leave empty to use Meta Title"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={() => setFormData({ ...formData, og_title: formData.meta_title })}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          ⚡ Copy from Meta Title
        </button>
      </div>

      {/* OG Description */}
      <div>
        <label className="block text-sm font-medium mb-1">OG Description (Social Share Description)</label>
        <textarea
          name="og_description"
          value={formData.og_description || ''}
          onChange={handleChange}
          placeholder="Leave empty to use Meta Description"
          rows="2"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={() => setFormData({ ...formData, og_description: formData.meta_description })}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          ⚡ Copy from Meta Description
        </button>
      </div>

      {/* OG Image */}
      <div>
        <label className="block text-sm font-medium mb-1">OG Image URL (Social Share Thumbnail)</label>
        <input
          type="url"
          name="og_image_url"
          value={formData.og_image_url || ''}
          onChange={handleChange}
          placeholder="https://example.com/og-image.jpg (1200x630 px recommended)"
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630 pixels for optimal display on social media.</p>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, og_image_url: formData.banner_url || formData.logo_url })}
          className="text-xs text-blue-600 hover:underline mt-1"
        >
          ⚡ Use Banner/Logo URL
        </button>
      </div>

      {/* Advanced SEO Settings */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ Advanced SEO Settings</h3>
      </div>

      {/* Canonical URL */}
      <div>
        <label className="block text-sm font-medium mb-1">Canonical URL</label>
        <input
          type="url"
          name="canonical_url"
          value={formData.canonical_url || ''}
          onChange={handleChange}
          placeholder="Leave empty to auto-generate from slug"
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Prevents duplicate content issues. Auto-generated if left empty.</p>
      </div>

      {/* Robots Meta */}
      <div>
        <label className="block text-sm font-medium mb-1">Robots Meta</label>
        <select
          name="robots_meta"
          value={formData.robots_meta || 'index, follow'}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="index, follow">index, follow (Recommended)</option>
          <option value="index, nofollow">index, nofollow</option>
          <option value="noindex, follow">noindex, follow</option>
          <option value="noindex, nofollow">noindex, nofollow</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Controls how search engines index this page.</p>
      </div>

      {/* Schema Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Schema Type (Rich Snippets)</label>
        <select
          name="schema_type"
          value={formData.schema_type || 'EducationalOrganization'}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="EducationalOrganization">EducationalOrganization (Default)</option>
          <option value="CollegeOrUniversity">CollegeOrUniversity</option>
          <option value="School">School</option>
          <option value="HighSchool">HighSchool</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">Helps search engines understand the type of institution for rich results.</p>
      </div>

      {/* SEO Preview */}
      <div className="border-t pt-4 mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">👁️ Search Result Preview</h3>
        <div className="bg-white border rounded-lg p-4 max-w-2xl">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
            {formData.meta_title || formData.name || 'Page Title'}
          </div>
          <div className="text-green-700 text-sm truncate">
            admissionbuddy.co › {entityType}s › {formData.slug || `${entityType}-slug`}
          </div>
          <div className="text-gray-600 text-sm mt-1 line-clamp-2">
            {formData.meta_description || 'Meta description will appear here. Add a compelling description to improve click-through rates.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoMetaSection;
