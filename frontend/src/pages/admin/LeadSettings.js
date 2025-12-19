import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiMail, FiMessageCircle, FiSettings, FiEdit3, FiBell } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const LeadSettings = () => {
  const [settings, setSettings] = useState({
    general_form_heading: 'Get Expert Counselling',
    general_form_subheading: 'Fill the form and our team will get back to you within 24 hours',
    general_form_enabled: true,
    cta_button_text: 'Apply Now',
    cta_button_color: '#f97316',
    show_floating_cta: true,
    show_header_cta: true,
    notification_emails: [],
    default_notification_email: '',
    enable_email_notifications: true,
    enable_whatsapp_notifications: true,
    whatsapp_business_number: '',
    email_subject: 'Thank you for your inquiry - {college_name}',
    email_template: '',
    whatsapp_message_template: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/lead-settings');
      setSettings(prev => ({ ...prev, ...response.data }));
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/lead-settings', settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addEmail = () => {
    if (newEmail && !settings.notification_emails.includes(newEmail)) {
      setSettings(prev => ({
        ...prev,
        notification_emails: [...prev.notification_emails, newEmail]
      }));
      setNewEmail('');
    }
  };

  const removeEmail = (email) => {
    setSettings(prev => ({
      ...prev,
      notification_emails: prev.notification_emails.filter(e => e !== email)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Lead Settings</h1>
            <p className="text-gray-600">Configure Apply Now forms and lead notifications</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <FiSave className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Form Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiEdit3 className="text-orange-500" />
              General Form Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Heading</label>
                <input
                  type="text"
                  value={settings.general_form_heading}
                  onChange={(e) => handleChange('general_form_heading', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Get Expert Counselling"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Subheading</label>
                <input
                  type="text"
                  value={settings.general_form_subheading}
                  onChange={(e) => handleChange('general_form_subheading', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Fill the form and our team will get back to you"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.general_form_enabled}
                  onChange={(e) => handleChange('general_form_enabled', e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span className="text-sm text-gray-700">Enable General Apply Now Form</span>
              </label>
            </div>
          </div>

          {/* CTA Button Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiSettings className="text-blue-500" />
              CTA Button Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={settings.cta_button_text}
                  onChange={(e) => handleChange('cta_button_text', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Apply Now"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.cta_button_color}
                    onChange={(e) => handleChange('cta_button_color', e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.cta_button_color}
                    onChange={(e) => handleChange('cta_button_color', e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="#f97316"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.show_floating_cta}
                  onChange={(e) => handleChange('show_floating_cta', e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span className="text-sm text-gray-700">Show Floating CTA Button</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.show_header_cta}
                  onChange={(e) => handleChange('show_header_cta', e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span className="text-sm text-gray-700">Show Header CTA Button</span>
              </label>
            </div>
            {/* Preview */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <button
                className="px-5 py-2.5 text-white font-semibold rounded-lg shadow"
                style={{ backgroundColor: settings.cta_button_color }}
              >
                {settings.cta_button_text || 'Apply Now'}
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiBell className="text-purple-500" />
              Notification Settings
            </h2>
            
            {/* Email Notifications */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiMail className="text-gray-500" />
                Email Notifications
              </h3>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={settings.enable_email_notifications}
                  onChange={(e) => handleChange('enable_email_notifications', e.target.checked)}
                  className="rounded text-orange-500"
                />
                <span className="text-sm text-gray-700">Enable Email Notifications for New Leads</span>
              </label>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Notification Email</label>
                <input
                  type="email"
                  value={settings.default_notification_email}
                  onChange={(e) => handleChange('default_notification_email', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notification Emails</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Add email address"
                    onKeyPress={(e) => e.key === 'Enter' && addEmail()}
                  />
                  <button
                    onClick={addEmail}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.notification_emails.map((email, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {email}
                      <button onClick={() => removeEmail(email)} className="hover:text-red-500">
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp Notifications */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <FiMessageCircle className="text-green-500" />
                WhatsApp Notifications
              </h3>
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={settings.enable_whatsapp_notifications}
                  onChange={(e) => handleChange('enable_whatsapp_notifications', e.target.checked)}
                  className="rounded text-green-500"
                />
                <span className="text-sm text-gray-700">Enable WhatsApp Notifications to Leads</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business Number</label>
                <input
                  type="text"
                  value={settings.whatsapp_business_number}
                  onChange={(e) => handleChange('whatsapp_business_number', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="919876543210 (with country code, no +)"
                />
                <p className="text-xs text-gray-500 mt-1">Used for wa.me links and Twilio WhatsApp API</p>
              </div>
            </div>
          </div>

          {/* Message Templates */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Message Templates</h2>
            <p className="text-sm text-gray-600 mb-4">
              Use placeholders: {'{name}'}, {'{email}'}, {'{mobile}'}, {'{city}'}, {'{course_interested}'}, {'{college_name}'}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                <input
                  type="text"
                  value={settings.email_subject}
                  onChange={(e) => handleChange('email_subject', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Thank you for your inquiry - {college_name}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Message Template</label>
                <textarea
                  value={settings.whatsapp_message_template}
                  onChange={(e) => handleChange('whatsapp_message_template', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 h-32"
                  placeholder="Hello {name}! Thank you for your interest in {college_name}..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LeadSettings;
