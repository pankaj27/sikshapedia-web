import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiGlobe, FiFileText, FiMapPin, FiCode, FiDownload, FiEye, FiCheck, FiAlertCircle, FiEdit2, FiToggleLeft, FiToggleRight, FiInfo, FiZap, FiRotateCcw } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';

const SEOSettings = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Tracking & Tags state
  const [trackingSettings, setTrackingSettings] = useState({
    google_analytics_id: '',
    google_search_console_verification: '',
    google_tag_manager_id: '',
    facebook_pixel_id: '',
    microsoft_clarity_id: '',
    custom_head_scripts: '',
    custom_body_scripts: '',
    meta_tags: {
      default_title: '',
      default_description: '',
      default_keywords: '',
      og_image: '',
      twitter_card: 'summary_large_image',
      twitter_site: ''
    }
  });
  
  // Schema state
  const [schemaReport, setSchemaReport] = useState(null);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [editingSchema, setEditingSchema] = useState(null);
  const [schemaJsonText, setSchemaJsonText] = useState('');
  
  // Sitemap state
  const [sitemapSettings, setSitemapSettings] = useState({
    include_colleges: true,
    include_schools: true,
    include_courses: true,
    include_exams: true,
    include_blogs: true,
    include_news: true,
    include_scholarships: true,
    include_study_abroad: true,
    include_static_pages: true,
    base_url: 'https://www.admissionbuddy.co',
    change_frequency: 'weekly',
    priority_homepage: 1.0,
    priority_listing: 0.8,
    priority_detail: 0.6,
    priority_blog: 0.5
  });
  const [sitemapPreview, setSitemapPreview] = useState(null);
  const [sitemapStats, setSitemapStats] = useState({});
  
  // Robots state
  const [robotsSettings, setRobotsSettings] = useState({
    content: '',
    allow_all: true,
    disallow_paths: [],
    custom_rules: ''
  });
  
  // Local SEO state
  const [localSEO, setLocalSEO] = useState({
    business_name: 'AdmissionBuddy',
    business_type: 'EducationalOrganization',
    description: '',
    url: 'https://www.admissionbuddy.co',
    logo_url: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'India'
    },
    social_profiles: [],
    opening_hours: '',
    geo_coordinates: { latitude: 0, longitude: 0 },
    service_areas: []
  });
  const [schemaPreview, setSchemaPreview] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tracking') {
        const res = await api.get('/seo/tracking-settings');
        if (res.data) setTrackingSettings(prev => ({ ...prev, ...res.data }));
      } else if (activeTab === 'sitemap') {
        const [settingsRes, previewRes, statsRes] = await Promise.all([
          api.get('/seo/sitemap/settings'),
          api.get('/seo/sitemap/preview'),
          api.get('/seo/sitemap/stats')
        ]);
        setSitemapSettings(settingsRes.data);
        setSitemapPreview(previewRes.data);
        setSitemapStats(statsRes.data);
      } else if (activeTab === 'robots') {
        const res = await api.get('/seo/robots');
        setRobotsSettings(res.data);
      } else if (activeTab === 'local') {
        const [seoRes, schemaRes] = await Promise.all([
          api.get('/seo/local'),
          api.get('/seo/local/schema')
        ]);
        setLocalSEO(seoRes.data);
        setSchemaPreview(schemaRes.data);
      } else if (activeTab === 'schema') {
        const res = await api.get('/seo/schemas/report/summary');
        setSchemaReport(res.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Schema functions
  const toggleSchema = async (schemaType, currentEnabled) => {
    try {
      const schemaData = schemaReport?.schemas?.find(s => s.schema_type === schemaType);
      await api.post(`/seo/schemas/${schemaType}`, {
        schema_type: schemaType,
        enabled: !currentEnabled,
        schema_data: schemaData?.schema || {}
      });
      showMessage('success', `Schema ${!currentEnabled ? 'enabled' : 'disabled'}`);
      fetchSettings();
    } catch (error) {
      showMessage('error', 'Failed to toggle schema');
    }
  };

  const openSchemaEditor = (schema) => {
    setSelectedSchema(schema);
    setEditingSchema(schema);
    setSchemaJsonText(JSON.stringify(schema.schema, null, 2));
  };

  const saveSchemaEdit = async () => {
    setSaving(true);
    try {
      const parsedSchema = JSON.parse(schemaJsonText);
      await api.post(`/seo/schemas/${editingSchema.schema_type}`, {
        schema_type: editingSchema.schema_type,
        enabled: editingSchema.enabled,
        schema_data: parsedSchema
      });
      showMessage('success', 'Schema saved successfully!');
      setSelectedSchema(null);
      setEditingSchema(null);
      fetchSettings();
    } catch (error) {
      if (error instanceof SyntaxError) {
        showMessage('error', 'Invalid JSON format');
      } else {
        showMessage('error', 'Failed to save schema');
      }
    } finally {
      setSaving(false);
    }
  };

  const resetSchema = async (schemaType) => {
    if (!window.confirm('Reset this schema to default? Your customizations will be lost.')) return;
    
    try {
      await api.post(`/seo/schemas/${schemaType}/reset`);
      showMessage('success', 'Schema reset to default');
      fetchSettings();
    } catch (error) {
      showMessage('error', 'Failed to reset schema');
    }
  };

  const saveSitemapSettings = async () => {
    setSaving(true);
    try {
      await api.post('/seo/sitemap/settings', sitemapSettings);
      showMessage('success', 'Sitemap settings saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save sitemap settings');
    } finally {
      setSaving(false);
    }
  };

  const generateSitemap = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/seo/sitemap/generate');
      showMessage('success', `Sitemap generated with ${res.data.url_count} URLs!`);
      // Refresh preview
      const previewRes = await api.get('/seo/sitemap/preview');
      setSitemapPreview(previewRes.data);
    } catch (error) {
      showMessage('error', 'Failed to generate sitemap');
    } finally {
      setGenerating(false);
    }
  };

  const saveRobotsSettings = async () => {
    setSaving(true);
    try {
      await api.post('/seo/robots', robotsSettings);
      showMessage('success', 'Robots.txt settings saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save robots.txt settings');
    } finally {
      setSaving(false);
    }
  };

  const saveLocalSEO = async () => {
    setSaving(true);
    try {
      await api.post('/seo/local', localSEO);
      showMessage('success', 'Local SEO settings saved successfully!');
      // Refresh schema preview
      const schemaRes = await api.get('/seo/local/schema');
      setSchemaPreview(schemaRes.data);
    } catch (error) {
      showMessage('error', 'Failed to save local SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const saveTrackingSettings = async () => {
    setSaving(true);
    try {
      await api.post('/seo/tracking-settings', trackingSettings);
      showMessage('success', 'Tracking & Tags settings saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save tracking settings');
    } finally {
      setSaving(false);
    }
  };

  const downloadSitemap = () => {
    if (sitemapPreview?.content) {
      const blob = new Blob([sitemapPreview.content], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const tabs = [
    { id: 'tracking', label: 'Tracking & Tags', icon: FiCode },
    { id: 'sitemap', label: 'Sitemap Generator', icon: FiGlobe },
    { id: 'robots', label: 'Robots.txt', icon: FiFileText },
    { id: 'local', label: 'Local SEO', icon: FiMapPin },
    { id: 'schema', label: 'Schema Markup', icon: FiCode }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-gray-600 mt-1">Manage sitemap, robots.txt, and local SEO for better search engine visibility</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id 
                  ? 'text-orange-600 border-orange-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Sitemap Tab */}
            {activeTab === 'sitemap' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {Object.entries(sitemapStats).map(([key, value]) => (
                    <div key={key} className="bg-white rounded-lg border p-4 text-center">
                      <p className="text-2xl font-bold text-orange-600">{value}</p>
                      <p className="text-xs text-gray-500 capitalize">{key}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Settings */}
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Sitemap Configuration</h3>
                    
                    {/* Base URL */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                      <input
                        type="text"
                        value={sitemapSettings.base_url}
                        onChange={(e) => setSitemapSettings({...sitemapSettings, base_url: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="https://www.example.com"
                      />
                    </div>

                    {/* Change Frequency */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Change Frequency</label>
                      <select
                        value={sitemapSettings.change_frequency}
                        onChange={(e) => setSitemapSettings({...sitemapSettings, change_frequency: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="always">Always</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>

                    {/* Include Options */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Include in Sitemap</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'include_colleges', label: 'Colleges' },
                          { key: 'include_schools', label: 'Schools' },
                          { key: 'include_courses', label: 'Courses' },
                          { key: 'include_exams', label: 'Exams' },
                          { key: 'include_blogs', label: 'Blogs' },
                          { key: 'include_news', label: 'News' },
                          { key: 'include_scholarships', label: 'Scholarships' },
                          { key: 'include_study_abroad', label: 'Study Abroad' },
                          { key: 'include_static_pages', label: 'Static Pages' },
                        ].map(item => (
                          <label key={item.key} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={sitemapSettings[item.key]}
                              onChange={(e) => setSitemapSettings({...sitemapSettings, [item.key]: e.target.checked})}
                              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Priority Settings */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority Settings</label>
                      <div className="space-y-2">
                        {[
                          { key: 'priority_homepage', label: 'Homepage' },
                          { key: 'priority_listing', label: 'Listing Pages' },
                          { key: 'priority_detail', label: 'Detail Pages' },
                          { key: 'priority_blog', label: 'Blog/News' },
                        ].map(item => (
                          <div key={item.key} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-28">{item.label}</span>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={sitemapSettings[item.key]}
                              onChange={(e) => setSitemapSettings({...sitemapSettings, [item.key]: parseFloat(e.target.value)})}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium w-10">{sitemapSettings[item.key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={saveSitemapSettings} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                        <FiSave className="mr-2" size={16} />
                        {saving ? 'Saving...' : 'Save Settings'}
                      </Button>
                      <Button onClick={generateSitemap} disabled={generating} variant="outline">
                        <FiRefreshCw className={`mr-2 ${generating ? 'animate-spin' : ''}`} size={16} />
                        {generating ? 'Generating...' : 'Generate Sitemap'}
                      </Button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Sitemap Preview</h3>
                      {sitemapPreview?.content && (
                        <Button onClick={downloadSitemap} size="sm" variant="outline">
                          <FiDownload className="mr-1" size={14} />
                          Download
                        </Button>
                      )}
                    </div>
                    
                    {sitemapPreview?.generated_at ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Generated: {new Date(sitemapPreview.generated_at).toLocaleString()} | 
                          URLs: {sitemapPreview.url_count}
                        </p>
                        <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-96 border">
                          {sitemapPreview.content?.substring(0, 3000)}
                          {sitemapPreview.content?.length > 3000 && '\n... (truncated)'}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FiGlobe size={40} className="mx-auto mb-2 opacity-50" />
                        <p>No sitemap generated yet</p>
                        <p className="text-xs">Click "Generate Sitemap" to create one</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Robots.txt Tab */}
            {activeTab === 'robots' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Robots.txt Editor</h3>
                  
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm mb-3">
                      <input
                        type="checkbox"
                        checked={robotsSettings.allow_all}
                        onChange={(e) => setRobotsSettings({...robotsSettings, allow_all: e.target.checked})}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      Allow all crawlers (User-agent: *)
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Robots.txt Content</label>
                    <textarea
                      value={robotsSettings.content}
                      onChange={(e) => setRobotsSettings({...robotsSettings, content: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm font-mono"
                      rows={15}
                      placeholder="User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/"
                    />
                  </div>

                  <Button onClick={saveRobotsSettings} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                    <FiSave className="mr-2" size={16} />
                    {saving ? 'Saving...' : 'Save Robots.txt'}
                  </Button>
                </div>

                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Reference</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Common Directives</h4>
                      <ul className="space-y-1 text-blue-700">
                        <li><code className="bg-blue-100 px-1 rounded">User-agent: *</code> - Applies to all bots</li>
                        <li><code className="bg-blue-100 px-1 rounded">Allow: /path/</code> - Allow crawling</li>
                        <li><code className="bg-blue-100 px-1 rounded">Disallow: /path/</code> - Block crawling</li>
                        <li><code className="bg-blue-100 px-1 rounded">Sitemap: URL</code> - Sitemap location</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Recommended Blocks</h4>
                      <ul className="space-y-1 text-yellow-700">
                        <li>• /admin/ - Admin panel</li>
                        <li>• /api/ - API endpoints</li>
                        <li>• /login, /register - Auth pages</li>
                        <li>• /user/ - User dashboard</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Live URL</h4>
                      <p className="text-green-700">
                        Your robots.txt will be served at:<br/>
                        <code className="bg-green-100 px-2 py-1 rounded text-xs">/api/seo/robots.txt</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Local SEO Tab */}
            {activeTab === 'local' && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Business Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        value={localSEO.business_name}
                        onChange={(e) => setLocalSEO({...localSEO, business_name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                      <select
                        value={localSEO.business_type}
                        onChange={(e) => setLocalSEO({...localSEO, business_type: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      >
                        <option value="EducationalOrganization">Educational Organization</option>
                        <option value="CollegeOrUniversity">College or University</option>
                        <option value="School">School</option>
                        <option value="Organization">Organization</option>
                        <option value="LocalBusiness">Local Business</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={localSEO.description}
                      onChange={(e) => setLocalSEO({...localSEO, description: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                      <input
                        type="url"
                        value={localSEO.url}
                        onChange={(e) => setLocalSEO({...localSEO, url: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                      <input
                        type="url"
                        value={localSEO.logo_url}
                        onChange={(e) => setLocalSEO({...localSEO, logo_url: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={localSEO.phone}
                        onChange={(e) => setLocalSEO({...localSEO, phone: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={localSEO.email}
                        onChange={(e) => setLocalSEO({...localSEO, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-800 pt-2">Address</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={localSEO.address?.street || ''}
                        onChange={(e) => setLocalSEO({...localSEO, address: {...localSEO.address, street: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={localSEO.address?.city || ''}
                        onChange={(e) => setLocalSEO({...localSEO, address: {...localSEO.address, city: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={localSEO.address?.state || ''}
                        onChange={(e) => setLocalSEO({...localSEO, address: {...localSEO.address, state: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={localSEO.address?.postal_code || ''}
                        onChange={(e) => setLocalSEO({...localSEO, address: {...localSEO.address, postal_code: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={localSEO.address?.country || 'India'}
                        onChange={(e) => setLocalSEO({...localSEO, address: {...localSEO.address, country: e.target.value}})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <h4 className="font-medium text-gray-800 pt-2">Geo Coordinates</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={localSEO.geo_coordinates?.latitude || 0}
                        onChange={(e) => setLocalSEO({...localSEO, geo_coordinates: {...localSEO.geo_coordinates, latitude: parseFloat(e.target.value)}})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={localSEO.geo_coordinates?.longitude || 0}
                        onChange={(e) => setLocalSEO({...localSEO, geo_coordinates: {...localSEO.geo_coordinates, longitude: parseFloat(e.target.value)}})}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={localSEO.opening_hours}
                      onChange={(e) => setLocalSEO({...localSEO, opening_hours: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="Mo-Sa 09:00-18:00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Social Profiles (one per line)</label>
                    <textarea
                      value={localSEO.social_profiles?.join('\n') || ''}
                      onChange={(e) => setLocalSEO({...localSEO, social_profiles: e.target.value.split('\n').filter(s => s.trim())})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      rows={4}
                      placeholder="https://facebook.com/yourpage
https://twitter.com/yourhandle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Areas (comma separated)</label>
                    <input
                      type="text"
                      value={localSEO.service_areas?.join(', ') || ''}
                      onChange={(e) => setLocalSEO({...localSEO, service_areas: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      placeholder="India, Delhi, Mumbai, Bangalore"
                    />
                  </div>

                  <Button onClick={saveLocalSEO} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                    <FiSave className="mr-2" size={16} />
                    {saving ? 'Saving...' : 'Save Local SEO'}
                  </Button>
                </div>

                <div className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FiCode size={18} />
                    JSON-LD Schema Preview
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    This schema markup will help search engines understand your business better.
                    Add this to your website's &lt;head&gt; section.
                  </p>

                  {schemaPreview && (
                    <div className="relative">
                      <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-auto max-h-[500px] border">
                        {JSON.stringify(schemaPreview, null, 2)}
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(schemaPreview, null, 2));
                          showMessage('success', 'Schema copied to clipboard!');
                        }}
                        className="absolute top-2 right-2 bg-white px-2 py-1 rounded border text-xs hover:bg-gray-50"
                      >
                        Copy
                      </button>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">How to use</h4>
                    <p className="text-sm text-blue-700">
                      Add this script to your website's &lt;head&gt;:
                    </p>
                    <pre className="bg-blue-100 p-2 rounded mt-2 text-xs overflow-x-auto">
{`<script type="application/ld+json">
${schemaPreview ? JSON.stringify(schemaPreview, null, 2) : '// Generated schema will appear here'}
</script>`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Schema Markup Tab */}
            {activeTab === 'schema' && (
              <div className="space-y-6">
                {/* Schema Editor Modal */}
                {selectedSchema && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                      <div className="p-4 border-b flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{selectedSchema.name}</h3>
                          <p className="text-sm text-gray-500">{selectedSchema.description}</p>
                        </div>
                        <button onClick={() => setSelectedSchema(null)} className="text-gray-500 hover:text-gray-700">
                          ✕
                        </button>
                      </div>
                      <div className="p-4 overflow-auto max-h-[60vh]">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schema JSON (Edit below)
                        </label>
                        <textarea
                          value={schemaJsonText}
                          onChange={(e) => setSchemaJsonText(e.target.value)}
                          className="w-full h-96 px-3 py-2 border rounded-lg text-sm font-mono"
                          spellCheck={false}
                        />
                        <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-sm">
                          <p className="font-medium text-yellow-800">💡 Dynamic Variables:</p>
                          <p className="text-yellow-700 text-xs mt-1">
                            Use placeholders like <code className="bg-yellow-100 px-1">{'{college_name}'}</code>, <code className="bg-yellow-100 px-1">{'{rating}'}</code>, etc. 
                            These will be replaced with actual data on each page.
                          </p>
                        </div>
                      </div>
                      <div className="p-4 border-t flex justify-between">
                        <Button onClick={() => resetSchema(selectedSchema.schema_type)} variant="outline" className="text-red-600">
                          <FiRotateCcw className="mr-2" size={14} />
                          Reset to Default
                        </Button>
                        <div className="flex gap-2">
                          <Button onClick={() => setSelectedSchema(null)} variant="outline">
                            Cancel
                          </Button>
                          <Button onClick={saveSchemaEdit} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
                            <FiSave className="mr-2" size={14} />
                            {saving ? 'Saving...' : 'Save Schema'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary Cards */}
                {schemaReport?.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{schemaReport.summary.total_schemas}</p>
                      <p className="text-sm text-gray-500">Total Schemas</p>
                    </div>
                    <div className="bg-white rounded-lg border p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{schemaReport.summary.enabled}</p>
                      <p className="text-sm text-gray-500">Enabled</p>
                    </div>
                    <div className="bg-white rounded-lg border p-4 text-center">
                      <p className="text-3xl font-bold text-gray-400">{schemaReport.summary.disabled}</p>
                      <p className="text-sm text-gray-500">Disabled</p>
                    </div>
                    <div className="bg-white rounded-lg border p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">{schemaReport.summary.customized}</p>
                      <p className="text-sm text-gray-500">Customized</p>
                    </div>
                  </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Schema List */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-gray-900">All Schema Types</h3>
                    
                    {schemaReport?.schemas?.map(schema => (
                      <div key={schema.schema_type} className={`bg-white rounded-lg border p-4 ${!schema.enabled ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900">{schema.name}</h4>
                              {schema.is_customized && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Customized</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{schema.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-400">Used on:</span>
                              {schema.pages?.map((page, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{page}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSchema(schema.schema_type, schema.enabled)}
                              className={`p-2 rounded-lg ${schema.enabled ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                              title={schema.enabled ? 'Disable' : 'Enable'}
                            >
                              {schema.enabled ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                            </button>
                            <button
                              onClick={() => openSchemaEditor(schema)}
                              className="p-2 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100"
                              title="Edit Schema"
                            >
                              <FiEdit2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        {/* Schema Preview */}
                        <details className="mt-3">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View Schema JSON
                          </summary>
                          <pre className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto max-h-40 border">
                            {JSON.stringify(schema.schema, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>

                  {/* Page Coverage & Tips */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Page Coverage</h3>
                      <div className="space-y-3">
                        {schemaReport?.page_coverage?.map((page, i) => (
                          <div key={i} className="border-b pb-2 last:border-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{page.page_type}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${page.enabled_count > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {page.enabled_count} active
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {page.schemas?.map((s, j) => (
                                <span key={j} className={`text-xs px-1.5 py-0.5 rounded ${s.enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                  {s.type}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <FiZap className="text-blue-600" />
                        SEO Tips
                      </h3>
                      <div className="space-y-2">
                        {schemaReport?.recommendations?.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <FiInfo className={`mt-0.5 flex-shrink-0 ${rec.type === 'tip' ? 'text-green-600' : 'text-blue-600'}`} size={14} />
                            <span className="text-gray-700">{rec.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">What is Schema?</h3>
                      <p className="text-sm text-gray-600">
                        Schema markup is structured data that helps search engines understand your content.
                        It enables <strong>rich snippets</strong> like star ratings, FAQs, and breadcrumbs in search results.
                      </p>
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-800">
                          <strong>Example:</strong> With Review schema, your college pages can show ⭐⭐⭐⭐⭐ ratings directly in Google search results!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default SEOSettings;
