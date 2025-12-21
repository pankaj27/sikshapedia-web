import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { id: 'twitter', name: 'Twitter / X', icon: FaTwitter, color: '#1DA1F2' },
  { id: 'instagram', name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
];

const FooterSettings = () => {
  const [settings, setSettings] = useState({
    copyright_text: '© 2025 admissionbuddy. All rights reserved.',
    company_name: 'admissionbuddy',
    social_links: SOCIAL_PLATFORMS.map(p => ({
      platform: p.id,
      url: '',
      is_active: true
    }))
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin-settings/footer');
      if (response.data) {
        // Ensure all platforms are present
        const existingLinks = response.data.social_links || [];
        const allLinks = SOCIAL_PLATFORMS.map(p => {
          const existing = existingLinks.find(l => l.platform === p.id);
          return existing || { platform: p.id, url: '', is_active: true };
        });
        setSettings({
          ...response.data,
          social_links: allLinks
        });
      }
    } catch (error) {
      console.error('Error fetching footer settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin-settings/footer', settings);
      alert('Footer settings saved successfully!');
    } catch (error) {
      console.error('Error saving footer settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSocialLink = (platform, field, value) => {
    setSettings(prev => ({
      ...prev,
      social_links: prev.social_links.map(link =>
        link.platform === platform ? { ...link, [field]: value } : link
      )
    }));
  };

  const getPlatformInfo = (platformId) => {
    return SOCIAL_PLATFORMS.find(p => p.id === platformId) || {};
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <FiRefreshCw className="animate-spin text-3xl text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Footer Settings</h1>
            <p className="text-gray-600">Manage copyright text and social media links</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            {saving ? <FiRefreshCw className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Copyright Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Copyright Information</CardTitle>
            <CardDescription>Update the copyright text displayed in the footer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={settings.company_name}
                  onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  placeholder="admissionbuddy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copyright_text">Copyright Text</Label>
                <Input
                  id="copyright_text"
                  value={settings.copyright_text}
                  onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                  placeholder="© 2025 admissionbuddy. All rights reserved."
                />
                <p className="text-xs text-gray-500">This text appears at the bottom of every page</p>
              </div>
            </div>
            
            {/* Preview */}
            <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg">
              <p className="text-sm text-center">{settings.copyright_text}</p>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>Add or update your social media profile links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {settings.social_links.map((link) => {
                const platform = getPlatformInfo(link.platform);
                const Icon = platform.icon;
                
                return (
                  <div key={link.platform} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: platform.color + '20' }}
                    >
                      {Icon && <Icon size={24} style={{ color: platform.color }} />}
                    </div>
                    
                    <div className="flex-1">
                      <Label className="font-medium">{platform.name}</Label>
                      <Input
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.platform, 'url', e.target.value)}
                        placeholder={`https://${link.platform}.com/admissionbuddy`}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Label className="text-sm text-gray-500">Active</Label>
                      <Switch
                        checked={link.is_active}
                        onCheckedChange={(checked) => updateSocialLink(link.platform, 'is_active', checked)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Social Links Preview */}
            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
              <p className="text-white text-sm mb-3 text-center">Preview</p>
              <div className="flex items-center justify-center gap-4">
                {settings.social_links
                  .filter(link => link.is_active && link.url)
                  .map(link => {
                    const platform = getPlatformInfo(link.platform);
                    const Icon = platform.icon;
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        {Icon && <Icon size={20} className="text-white" />}
                      </a>
                    );
                  })}
                {settings.social_links.filter(link => link.is_active && link.url).length === 0 && (
                  <p className="text-gray-400 text-sm">No active social links</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button at Bottom */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
            {saving ? <FiRefreshCw className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FooterSettings;
