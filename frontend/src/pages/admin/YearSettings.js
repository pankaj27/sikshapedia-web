import React, { useState, useEffect } from 'react';
import { FiCalendar, FiSave, FiRefreshCw, FiInfo, FiCheck } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';

const YearSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preview, setPreview] = useState(null);

  const defaultSettings = {
    mode: 'auto',
    manual_year: new Date().getFullYear(),
    auto_switch_month: 7
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Fetch preview whenever year changes
    if (settings) {
      const yearToPreview = settings.mode === 'auto' 
        ? settings.computed_auto_year 
        : settings.manual_year;
      fetchPreview(yearToPreview);
    }
  }, [settings?.mode, settings?.manual_year, settings?.computed_auto_year]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/year-settings/admin');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        ...defaultSettings,
        computed_auto_year: new Date().getFullYear(),
        current_active_year: new Date().getFullYear()
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async (year) => {
    try {
      const response = await api.post(`/year-settings/preview?year=${year}`);
      setPreview(response.data);
    } catch (error) {
      console.error('Error fetching preview:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await api.put('/year-settings', settings);
      setSettings(response.data);
      setMessage({ type: 'success', text: 'Year settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const activeYear = settings.mode === 'auto' ? settings.computed_auto_year : settings.manual_year;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiCalendar className="text-orange-500" />
            Year Configuration
          </h1>
          <p className="text-gray-600">Manage the admission year displayed across the platform</p>
        </div>
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
        >
          <FiSave size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Current Active Year Display */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6 mb-6">
        <div className="text-center">
          <p className="text-orange-100 text-sm mb-1">Currently Displaying</p>
          <p className="text-5xl font-bold mb-2">{activeYear}</p>
          <p className="text-orange-100">
            Mode: <span className="font-semibold text-white capitalize">{settings.mode}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Year Mode</h2>
          
          <div className="space-y-4">
            {/* Auto Mode */}
            <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${settings.mode === 'auto' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                name="mode"
                value="auto"
                checked={settings.mode === 'auto'}
                onChange={(e) => updateField('mode', e.target.value)}
                className="mt-1 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Automatic Mode</span>
                  {settings.mode === 'auto' && <FiCheck className="text-orange-500" />}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Year changes automatically on {getMonthName(settings.auto_switch_month)} 1st each year
                </p>
                {settings.mode === 'auto' && (
                  <p className="text-sm text-orange-600 mt-2">
                    Current auto-detected year: <strong>{settings.computed_auto_year}</strong>
                  </p>
                )}
              </div>
            </label>

            {/* Manual Mode */}
            <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${settings.mode === 'manual' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input
                type="radio"
                name="mode"
                value="manual"
                checked={settings.mode === 'manual'}
                onChange={(e) => updateField('mode', e.target.value)}
                className="mt-1 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Manual Mode</span>
                  {settings.mode === 'manual' && <FiCheck className="text-orange-500" />}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Set a specific year manually
                </p>
                {settings.mode === 'manual' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={settings.manual_year}
                      onChange={(e) => updateField('manual_year', parseInt(e.target.value) || new Date().getFullYear())}
                      min={2020}
                      max={2050}
                      className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Auto Switch Month (only for auto mode) */}
          {settings.mode === 'auto' && (
            <div className="mt-6 pt-6 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-Switch Month
              </label>
              <select
                value={settings.auto_switch_month}
                onChange={(e) => updateField('auto_switch_month', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                  <option key={month} value={month}>{getMonthName(month)}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Year will increment on the 1st of this month
              </p>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiInfo className="text-blue-500" />
            Live Preview
          </h2>
          
          {preview && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                This is how the year will appear across the platform:
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Page Titles:</span>
                  <span className="font-medium">{preview.formats.colleges_title}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Admission Text:</span>
                  <span className="font-medium">{preview.formats.admission}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Academic Year:</span>
                  <span className="font-medium">{preview.formats.academic}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Courses Title:</span>
                  <span className="font-medium">{preview.formats.courses_title}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Exam Title:</span>
                  <span className="font-medium">{preview.formats.exam_title}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <FiInfo className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-blue-900">Where will this year be displayed?</h3>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• All listing page headings (Colleges, Schools, Courses, Exams)</li>
              <li>• College/Institute detail page titles</li>
              <li>• Meta titles and descriptions (SEO)</li>
              <li>• Breadcrumbs and navigation</li>
              <li>• Admission-related content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearSettings;
