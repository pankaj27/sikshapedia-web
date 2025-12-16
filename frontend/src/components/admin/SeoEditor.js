import React from 'react';

/**
 * Reusable SEO Editor Component
 * Used for both main page SEO and custom menu page SEO
 */
const SeoEditor = ({
  data,
  onChange,
  collegeName = '',
  cityName = '',
  pageLabel = '',
  showAutoFillAll = true,
  compact = false
}) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const autoGenerateMetaTitle = () => {
    const title = pageLabel
      ? `${pageLabel} - ${collegeName}${cityName ? `, ${cityName}` : ''} | Admissionbuddy`
      : `${collegeName}${cityName ? ` - ${cityName}` : ''} | Admission, Fees, Ranking - Admissionbuddy`;
    handleChange('meta_title', title.substring(0, 60));
  };

  const autoGenerateMetaDescription = () => {
    const desc = pageLabel
      ? `Explore ${pageLabel} at ${collegeName || 'this institution'}. Get complete details on ${pageLabel.toLowerCase()}, eligibility, requirements and more. Apply now through Admissionbuddy.`
      : `Get complete details on ${collegeName || 'this institution'} admission ${new Date().getFullYear()}, fee structure, courses offered, placements, ranking & cutoff. Apply now through Admissionbuddy.`;
    handleChange('meta_description', desc.substring(0, 160));
  };

  const autoGenerateKeywords = () => {
    const keywords = pageLabel
      ? [collegeName, pageLabel, cityName, `${pageLabel.toLowerCase()} ${new Date().getFullYear()}`, 'admissionbuddy']
      : [collegeName, cityName, 'admission ' + new Date().getFullYear(), 'fees', 'ranking', 'courses', 'placement'];
    handleChange('meta_keywords', keywords.filter(Boolean).join(', '));
  };

  const autoFillAll = () => {
    const title = pageLabel
      ? `${pageLabel} - ${collegeName}${cityName ? `, ${cityName}` : ''} | Admissionbuddy`
      : `${collegeName}${cityName ? ` - ${cityName}` : ''} | Admission, Fees, Ranking - Admissionbuddy`;
    
    const desc = pageLabel
      ? `Explore ${pageLabel} at ${collegeName || 'this institution'}. Get complete details on ${pageLabel.toLowerCase()}, eligibility, requirements and more. Apply now through Admissionbuddy.`
      : `Get complete details on ${collegeName || 'this institution'} admission ${new Date().getFullYear()}, fee structure, courses offered, placements, ranking & cutoff. Apply now through Admissionbuddy.`;
    
    const keywords = pageLabel
      ? [collegeName, pageLabel, cityName, `${pageLabel.toLowerCase()} ${new Date().getFullYear()}`, 'admissionbuddy']
      : [collegeName, cityName, 'admission ' + new Date().getFullYear(), 'fees', 'ranking', 'courses', 'placement'];

    onChange({
      ...data,
      meta_title: title.substring(0, 60),
      meta_description: desc.substring(0, 160),
      meta_keywords: keywords.filter(Boolean).join(', '),
      og_title: title.substring(0, 60),
      og_description: desc.substring(0, 160)
    });
  };

  const labelClass = compact ? 'block text-xs text-gray-500 mb-1' : 'block text-sm font-medium mb-1';
  const inputClass = compact ? 'w-full border rounded px-2 py-1 text-xs' : 'w-full border-2 rounded px-3 py-2';
  const charCountClass = compact ? 'text-xs text-gray-400' : 'text-xs';

  return (
    <div className="space-y-4">
      {/* Meta Title */}
      <div className={compact ? 'col-span-2' : ''}>
        <div className="flex justify-between items-center mb-1">
          <label className={labelClass}>
            Meta Title {!compact && <span className="text-gray-400">(50-60 chars)</span>}
          </label>
          <span className={`${charCountClass} ${(data.meta_title?.length || 0) > 60 ? 'text-red-500' : 'text-gray-500'}`}>
            {data.meta_title?.length || 0}/60
          </span>
        </div>
        <input
          type="text"
          value={data.meta_title || ''}
          onChange={(e) => handleChange('meta_title', e.target.value)}
          placeholder={pageLabel ? `${pageLabel} - ${collegeName || 'College Name'}` : 'e.g., IIT Bombay - Admission 2025, Fees, Ranking | Admissionbuddy'}
          className={`${inputClass} ${(data.meta_title?.length || 0) > 60 ? 'border-red-300' : 'border-gray-200'}`}
          maxLength={70}
        />
        <div className="flex justify-end mt-0.5">
          <button
            type="button"
            onClick={autoGenerateMetaTitle}
            className="text-xs text-blue-600 hover:underline"
          >
            ⚡ Auto-generate
          </button>
        </div>
      </div>

      {/* Meta Description */}
      <div className={compact ? 'col-span-2' : ''}>
        <div className="flex justify-between items-center mb-1">
          <label className={labelClass}>
            Meta Description {!compact && <span className="text-gray-400">(150-160 chars)</span>}
          </label>
          <span className={`${charCountClass} ${(data.meta_description?.length || 0) > 160 ? 'text-red-500' : (data.meta_description?.length || 0) > 150 ? 'text-yellow-500' : 'text-gray-500'}`}>
            {data.meta_description?.length || 0}/160
          </span>
        </div>
        <textarea
          value={data.meta_description || ''}
          onChange={(e) => handleChange('meta_description', e.target.value)}
          placeholder="Brief description of this page for search engines..."
          rows={compact ? 2 : 3}
          className={`${inputClass} ${(data.meta_description?.length || 0) > 160 ? 'border-red-300' : 'border-gray-200'}`}
          maxLength={170}
        />
        <div className="flex justify-end mt-0.5">
          <button
            type="button"
            onClick={autoGenerateMetaDescription}
            className="text-xs text-blue-600 hover:underline"
          >
            ⚡ Auto-generate
          </button>
        </div>
      </div>

      {/* Meta Keywords */}
      <div className={compact ? 'col-span-2' : ''}>
        <label className={labelClass}>
          Meta Keywords {!compact && <span className="text-gray-400">(comma separated)</span>}
        </label>
        <input
          type="text"
          value={data.meta_keywords || ''}
          onChange={(e) => handleChange('meta_keywords', e.target.value)}
          placeholder="keyword1, keyword2, keyword3"
          className={inputClass}
        />
        <div className="flex justify-end mt-0.5">
          <button
            type="button"
            onClick={autoGenerateKeywords}
            className="text-xs text-blue-600 hover:underline"
          >
            ⚡ Auto-generate
          </button>
        </div>
      </div>

      {/* OG Fields */}
      <div className={compact ? '' : 'border-t pt-4 mt-4'}>
        {!compact && <h3 className="text-sm font-semibold text-gray-700 mb-3">📱 Open Graph (Social Media)</h3>}
        <div className={compact ? 'grid grid-cols-2 gap-2' : 'space-y-4'}>
          {/* OG Title */}
          <div>
            <label className={labelClass}>OG Title</label>
            <input
              type="text"
              value={data.og_title || ''}
              onChange={(e) => handleChange('og_title', e.target.value)}
              placeholder="Social media title"
              className={inputClass}
            />
            <div className="flex justify-end mt-0.5">
              <button
                type="button"
                onClick={() => handleChange('og_title', data.meta_title || '')}
                className="text-xs text-blue-600 hover:underline"
              >
                ⚡ Copy from Meta Title
              </button>
            </div>
          </div>

          {/* OG Description */}
          <div>
            <label className={labelClass}>OG Description</label>
            <input
              type="text"
              value={data.og_description || ''}
              onChange={(e) => handleChange('og_description', e.target.value)}
              placeholder="Social media description"
              className={inputClass}
            />
            <div className="flex justify-end mt-0.5">
              <button
                type="button"
                onClick={() => handleChange('og_description', data.meta_description || '')}
                className="text-xs text-blue-600 hover:underline"
              >
                ⚡ Copy from Meta Description
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-fill All Button */}
      {showAutoFillAll && (
        <div className={compact ? 'col-span-2 pt-2 border-t border-gray-100' : 'pt-4'}>
          <button
            type="button"
            onClick={autoFillAll}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
          >
            ⚡ Auto-fill All SEO Fields
          </button>
        </div>
      )}
    </div>
  );
};

export default SeoEditor;
