import React from 'react';
import CollapsibleSection from '../CollapsibleSection';

// Toggle switch component for reusability
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
);

// Widget container component
const WidgetCard = ({ emoji, title, description, enabled, onToggle, children }) => (
  <div className="border-2 rounded-lg p-4 bg-white">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ToggleSwitch checked={enabled} onChange={onToggle} />
    </div>
    {enabled && children && (
      <div className="pl-8 border-t pt-4">
        {children}
      </div>
    )}
  </div>
);

const SidebarWidgetsSection = ({ formData, setFormData }) => {
  // Helper to update sidebar widget
  const updateWidget = (widgetKey, field, value) => {
    setFormData({
      ...formData,
      sidebar_widgets: {
        ...formData.sidebar_widgets,
        [widgetKey]: { 
          ...formData.sidebar_widgets?.[widgetKey], 
          [field]: value 
        }
      }
    });
  };

  return (
    <CollapsibleSection title="Sidebar Widgets Configuration" icon="📱" defaultOpen={false}>
      <p className="text-sm text-gray-600 mb-4">
        Configure which widgets appear on the college detail page sidebar. Toggle widgets on/off and customize their settings.
      </p>

      <div className="space-y-6">
        {/* Quick Actions Widget */}
        <WidgetCard
          emoji="🚀"
          title="Quick Actions"
          description="Apply Now, Download Brochure, Compare buttons"
          enabled={formData.sidebar_widgets?.quick_actions?.enabled ?? true}
          onToggle={(e) => updateWidget('quick_actions', 'enabled', e.target.checked)}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.sidebar_widgets?.quick_actions?.apply_now_btn ?? true}
                onChange={(e) => updateWidget('quick_actions', 'apply_now_btn', e.target.checked)}
                className="rounded"
              />
              Apply Now Button
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.sidebar_widgets?.quick_actions?.download_brochure_btn ?? true}
                onChange={(e) => updateWidget('quick_actions', 'download_brochure_btn', e.target.checked)}
                className="rounded"
              />
              Download Brochure
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.sidebar_widgets?.quick_actions?.compare_btn ?? true}
                onChange={(e) => updateWidget('quick_actions', 'compare_btn', e.target.checked)}
                className="rounded"
              />
              Compare Button
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.sidebar_widgets?.quick_actions?.enquiry_btn ?? true}
                onChange={(e) => updateWidget('quick_actions', 'enquiry_btn', e.target.checked)}
                className="rounded"
              />
              Send Enquiry
            </label>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Custom Apply Now URL (optional)</label>
              <input
                type="url"
                value={formData.sidebar_widgets?.quick_actions?.apply_now_url || ''}
                onChange={(e) => updateWidget('quick_actions', 'apply_now_url', e.target.value)}
                placeholder="Leave empty for default"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Quick Facts Widget */}
        <WidgetCard
          emoji="📊"
          title="Quick Facts"
          description="Key statistics about the institution"
          enabled={formData.sidebar_widgets?.quick_facts?.enabled ?? true}
          onToggle={(e) => updateWidget('quick_facts', 'enabled', e.target.checked)}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_established ?? true}
                onChange={(e) => updateWidget('quick_facts', 'show_established', e.target.checked)} className="rounded" />
              Show Established Year
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_type ?? true}
                onChange={(e) => updateWidget('quick_facts', 'show_type', e.target.checked)} className="rounded" />
              Show Institution Type
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_campus_size ?? true}
                onChange={(e) => updateWidget('quick_facts', 'show_campus_size', e.target.checked)} className="rounded" />
              Show Campus Size
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.quick_facts?.show_total_students ?? true}
                onChange={(e) => updateWidget('quick_facts', 'show_total_students', e.target.checked)} className="rounded" />
              Show Total Students
            </label>
          </div>
        </WidgetCard>

        {/* Important Dates Widget */}
        <WidgetCard
          emoji="📅"
          title="Important Dates"
          description="Admission deadlines and events"
          enabled={formData.sidebar_widgets?.important_dates?.enabled ?? true}
          onToggle={(e) => updateWidget('important_dates', 'enabled', e.target.checked)}
        >
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.important_dates?.show_application_deadline ?? true}
                onChange={(e) => updateWidget('important_dates', 'show_application_deadline', e.target.checked)} className="rounded" />
              Show Application Deadline
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.important_dates?.show_exam_dates ?? true}
                onChange={(e) => updateWidget('important_dates', 'show_exam_dates', e.target.checked)} className="rounded" />
              Show Exam Dates
            </label>
          </div>
        </WidgetCard>

        {/* Fee Summary Widget */}
        <WidgetCard
          emoji="💰"
          title="Fee Summary"
          description="Quick overview of fees"
          enabled={formData.sidebar_widgets?.fee_summary?.enabled ?? true}
          onToggle={(e) => updateWidget('fee_summary', 'enabled', e.target.checked)}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.fee_summary?.show_avg_fee ?? true}
                onChange={(e) => updateWidget('fee_summary', 'show_avg_fee', e.target.checked)} className="rounded" />
              Show Average Fee
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.fee_summary?.show_fee_range ?? true}
                onChange={(e) => updateWidget('fee_summary', 'show_fee_range', e.target.checked)} className="rounded" />
              Show Fee Range
            </label>
          </div>
        </WidgetCard>

        {/* Contact Card Widget */}
        <WidgetCard
          emoji="📞"
          title="Contact Card"
          description="Contact information display"
          enabled={formData.sidebar_widgets?.contact_card?.enabled ?? true}
          onToggle={(e) => updateWidget('contact_card', 'enabled', e.target.checked)}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_phone ?? true}
                onChange={(e) => updateWidget('contact_card', 'show_phone', e.target.checked)} className="rounded" />
              Show Phone
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_email ?? true}
                onChange={(e) => updateWidget('contact_card', 'show_email', e.target.checked)} className="rounded" />
              Show Email
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_website ?? true}
                onChange={(e) => updateWidget('contact_card', 'show_website', e.target.checked)} className="rounded" />
              Show Website
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.contact_card?.show_address ?? true}
                onChange={(e) => updateWidget('contact_card', 'show_address', e.target.checked)} className="rounded" />
              Show Address
            </label>
          </div>
        </WidgetCard>

        {/* Counselor CTA Widget */}
        <WidgetCard
          emoji="👨‍💼"
          title="Talk to Counselor"
          description="CTA for counselor consultation"
          enabled={formData.sidebar_widgets?.counselor_cta?.enabled ?? true}
          onToggle={(e) => updateWidget('counselor_cta', 'enabled', e.target.checked)}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">CTA Text</label>
              <input
                type="text"
                value={formData.sidebar_widgets?.counselor_cta?.cta_text || 'Talk to Expert Counselor'}
                onChange={(e) => updateWidget('counselor_cta', 'cta_text', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.sidebar_widgets?.counselor_cta?.phone || ''}
                onChange={(e) => updateWidget('counselor_cta', 'phone', e.target.value)}
                placeholder="Enter counselor phone"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </WidgetCard>

        {/* Ad Banner Widget */}
        <WidgetCard
          emoji="📣"
          title="Ad Banner"
          description="Promotional banner space in sidebar"
          enabled={formData.sidebar_widgets?.ad_banner?.enabled ?? false}
          onToggle={(e) => updateWidget('ad_banner', 'enabled', e.target.checked)}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Banner Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.sidebar_widgets?.ad_banner?.image_url || ''}
                  onChange={(e) => updateWidget('ad_banner', 'image_url', e.target.value)}
                  placeholder="Enter banner image URL or upload"
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <label className="px-3 py-1 bg-blue-500 text-white text-xs rounded cursor-pointer hover:bg-blue-600">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const token = localStorage.getItem('adminToken');
                          const formDataUpload = new FormData();
                          formDataUpload.append('file', file);
                          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload/image?type=banner`, {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`
                            },
                            body: formDataUpload
                          });
                          const data = await response.json();
                          if (data.url) {
                            updateWidget('ad_banner', 'image_url', data.url);
                          } else {
                            alert('Failed to upload: ' + (data.detail || 'Unknown error'));
                          }
                        } catch (err) {
                          console.error('Upload failed:', err);
                          alert('Failed to upload banner image');
                        }
                      }
                    }}
                  />
                </label>
              </div>
              {formData.sidebar_widgets?.ad_banner?.image_url && (
                <img 
                  src={formData.sidebar_widgets.ad_banner.image_url} 
                  alt="Banner Preview" 
                  className="mt-2 w-full h-24 object-cover rounded border"
                />
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Banner Title (optional)</label>
              <input
                type="text"
                value={formData.sidebar_widgets?.ad_banner?.title || ''}
                onChange={(e) => updateWidget('ad_banner', 'title', e.target.value)}
                placeholder="e.g., Special Offer!"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Banner Description (optional)</label>
              <input
                type="text"
                value={formData.sidebar_widgets?.ad_banner?.description || ''}
                onChange={(e) => updateWidget('ad_banner', 'description', e.target.value)}
                placeholder="e.g., Get 20% off on application fees"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div className="border-t pt-3 mt-3">
              <label className="flex items-center gap-2 text-sm mb-2">
                <input 
                  type="checkbox" 
                  checked={formData.sidebar_widgets?.ad_banner?.show_cta_button !== false}
                  onChange={(e) => updateWidget('ad_banner', 'show_cta_button', e.target.checked)} 
                  className="rounded" 
                />
                Show CTA Button
              </label>
              {formData.sidebar_widgets?.ad_banner?.show_cta_button !== false && (
                <div className="space-y-2 pl-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={formData.sidebar_widgets?.ad_banner?.cta_text || 'Learn More'}
                      onChange={(e) => updateWidget('ad_banner', 'cta_text', e.target.value)}
                      placeholder="e.g., Apply Now, Learn More"
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">CTA Button URL</label>
                    <input
                      type="url"
                      value={formData.sidebar_widgets?.ad_banner?.cta_url || ''}
                      onChange={(e) => updateWidget('ad_banner', 'cta_url', e.target.value)}
                      placeholder="https://example.com/offer"
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </WidgetCard>

        {/* Career Counseling Widget */}
        <WidgetCard
          emoji="💼"
          title="Career Counseling"
          description="Book session for career guidance"
          enabled={formData.sidebar_widgets?.career_counseling?.enabled ?? true}
          onToggle={(e) => updateWidget('career_counseling', 'enabled', e.target.checked)}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Widget Title</label>
              <input
                type="text"
                value={formData.sidebar_widgets?.career_counseling?.title || 'Career Counseling'}
                onChange={(e) => updateWidget('career_counseling', 'title', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.sidebar_widgets?.career_counseling?.subtitle || 'Get personalized career guidance from experts'}
                onChange={(e) => updateWidget('career_counseling', 'subtitle', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Button Text</label>
              <input
                type="text"
                value={formData.sidebar_widgets?.career_counseling?.button_text || 'Book Session'}
                onChange={(e) => updateWidget('career_counseling', 'button_text', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Booking Type</label>
              <select
                value={formData.sidebar_widgets?.career_counseling?.booking_type || 'link'}
                onChange={(e) => updateWidget('career_counseling', 'booking_type', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="link">External Link (URL)</option>
                <option value="phone">Phone Call</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>
            {formData.sidebar_widgets?.career_counseling?.booking_type === 'link' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Booking URL</label>
                <input
                  type="url"
                  value={formData.sidebar_widgets?.career_counseling?.booking_url || ''}
                  onChange={(e) => updateWidget('career_counseling', 'booking_url', e.target.value)}
                  placeholder="https://calendly.com/your-link"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            )}
            {formData.sidebar_widgets?.career_counseling?.booking_type === 'phone' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.sidebar_widgets?.career_counseling?.booking_phone || ''}
                  onChange={(e) => updateWidget('career_counseling', 'booking_phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            )}
            {formData.sidebar_widgets?.career_counseling?.booking_type === 'whatsapp' && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.sidebar_widgets?.career_counseling?.booking_whatsapp || ''}
                  onChange={(e) => updateWidget('career_counseling', 'booking_whatsapp', e.target.value)}
                  placeholder="919876543210 (without + or spaces)"
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            )}
          </div>
        </WidgetCard>

        {/* Social Share Widget */}
        <WidgetCard
          emoji="🔗"
          title="Social Share"
          description="Share on social media buttons"
          enabled={formData.sidebar_widgets?.social_share?.enabled ?? true}
          onToggle={(e) => updateWidget('social_share', 'enabled', e.target.checked)}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.social_share?.facebook ?? true}
                onChange={(e) => updateWidget('social_share', 'facebook', e.target.checked)} className="rounded" />
              Facebook
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.social_share?.twitter ?? true}
                onChange={(e) => updateWidget('social_share', 'twitter', e.target.checked)} className="rounded" />
              Twitter
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.social_share?.whatsapp ?? true}
                onChange={(e) => updateWidget('social_share', 'whatsapp', e.target.checked)} className="rounded" />
              WhatsApp
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.social_share?.linkedin ?? true}
                onChange={(e) => updateWidget('social_share', 'linkedin', e.target.checked)} className="rounded" />
              LinkedIn
            </label>
          </div>
        </WidgetCard>

        {/* Rating Widget */}
        <WidgetCard
          emoji="⭐"
          title="Rating & Reviews"
          description="User ratings display"
          enabled={formData.sidebar_widgets?.rating_widget?.enabled ?? true}
          onToggle={(e) => updateWidget('rating_widget', 'enabled', e.target.checked)}
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.rating_widget?.show_stars ?? true}
                onChange={(e) => updateWidget('rating_widget', 'show_stars', e.target.checked)} className="rounded" />
              Show Star Rating
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.rating_widget?.show_review_count ?? true}
                onChange={(e) => updateWidget('rating_widget', 'show_review_count', e.target.checked)} className="rounded" />
              Show Review Count
            </label>
          </div>
        </WidgetCard>

        {/* Related Colleges Widget */}
        <WidgetCard
          emoji="🏫"
          title="Related Colleges"
          description="Similar institutions suggestions"
          enabled={formData.sidebar_widgets?.related_colleges?.enabled ?? true}
          onToggle={(e) => updateWidget('related_colleges', 'enabled', e.target.checked)}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max Colleges to Show</label>
              <select
                value={formData.sidebar_widgets?.related_colleges?.max_count || 5}
                onChange={(e) => updateWidget('related_colleges', 'max_count', parseInt(e.target.value))}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value={3}>3 Colleges</option>
                <option value={5}>5 Colleges</option>
                <option value={10}>10 Colleges</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.sidebar_widgets?.related_colleges?.same_state ?? true}
                onChange={(e) => updateWidget('related_colleges', 'same_state', e.target.checked)} className="rounded" />
              Prioritize same state
            </label>
          </div>
        </WidgetCard>
      </div>

      {/* Widget Preview */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">👁️ Active Widgets Preview</h4>
        <div className="flex flex-wrap gap-2">
          {formData.sidebar_widgets?.quick_actions?.enabled && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">🚀 Quick Actions</span>}
          {formData.sidebar_widgets?.quick_facts?.enabled && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">📊 Quick Facts</span>}
          {formData.sidebar_widgets?.important_dates?.enabled && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">📅 Important Dates</span>}
          {formData.sidebar_widgets?.fee_summary?.enabled && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">💰 Fee Summary</span>}
          {formData.sidebar_widgets?.contact_card?.enabled && <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded">📞 Contact Card</span>}
          {formData.sidebar_widgets?.counselor_cta?.enabled && <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">👨‍💼 Counselor CTA</span>}
          {formData.sidebar_widgets?.career_counseling?.enabled && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">💼 Career Counseling</span>}
          {formData.sidebar_widgets?.ad_banner?.enabled && <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">📣 Ad Banner</span>}
          {formData.sidebar_widgets?.social_share?.enabled && <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded">🔗 Social Share</span>}
          {formData.sidebar_widgets?.rating_widget?.enabled && <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">⭐ Rating</span>}
          {formData.sidebar_widgets?.related_colleges?.enabled && <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">🏫 Related</span>}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default SidebarWidgetsSection;
