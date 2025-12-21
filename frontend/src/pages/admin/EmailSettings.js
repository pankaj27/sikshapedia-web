import React, { useState, useEffect } from 'react';
import { FiMail, FiSave, FiRefreshCw, FiEdit2, FiEye, FiTrash2, FiPlus, FiCheck, FiX, FiSettings, FiFileText } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

const EmailSettings = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [settings, setSettings] = useState({
    sender_name: '',
    sender_email: '',
    reply_to_email: '',
    email_provider: 'resend',
    footer_text: '',
    logo_url: '',
    primary_color: '#f97316'
  });
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, templatesRes] = await Promise.all([
        api.get('/admin/email/settings'),
        api.get('/admin/email/templates')
      ]);
      setSettings(settingsRes.data);
      setTemplates(templatesRes.data);
    } catch (error) {
      console.error('Error fetching email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/admin/email/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewTemplate = async (templateKey) => {
    try {
      const response = await api.post(`/admin/email/templates/${templateKey}/preview`);
      setPreviewSubject(response.data.subject);
      setPreviewHtml(response.data.html_content);
      setShowPreview(true);
    } catch (error) {
      console.error('Error previewing template:', error);
      alert('Failed to preview template');
    }
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate({ ...template });
    setShowEditor(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    
    setSaving(true);
    try {
      await api.put(`/admin/email/templates/${editingTemplate.template_key}`, editingTemplate);
      await fetchData();
      setShowEditor(false);
      setEditingTemplate(null);
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleResetTemplates = async () => {
    if (!window.confirm('Are you sure you want to reset all templates to defaults? This will overwrite all your customizations.')) {
      return;
    }
    
    try {
      await api.post('/admin/email/templates/reset-defaults');
      await fetchData();
      alert('Templates reset to defaults!');
    } catch (error) {
      console.error('Error resetting templates:', error);
      alert('Failed to reset templates');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiRefreshCw className="animate-spin text-3xl text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Settings</h1>
          <p className="text-gray-600">Configure outgoing emails and manage email templates</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <FiSettings className="w-4 h-4" />
            Email Configuration
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FiFileText className="w-4 h-4" />
            Email Templates
          </TabsTrigger>
        </TabsList>

        {/* Email Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Outgoing Email Configuration</CardTitle>
              <CardDescription>Configure sender information and email provider settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sender_name">Sender Name</Label>
                  <Input
                    id="sender_name"
                    value={settings.sender_name}
                    onChange={(e) => setSettings({ ...settings, sender_name: e.target.value })}
                    placeholder="admissionbuddy"
                  />
                  <p className="text-xs text-gray-500">This name appears in the "From" field</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_email">Sender Email</Label>
                  <Input
                    id="sender_email"
                    type="email"
                    value={settings.sender_email}
                    onChange={(e) => setSettings({ ...settings, sender_email: e.target.value })}
                    placeholder="noreply@admissionbuddy.co"
                  />
                  <p className="text-xs text-gray-500">Emails will be sent from this address</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reply_to_email">Reply-To Email</Label>
                  <Input
                    id="reply_to_email"
                    type="email"
                    value={settings.reply_to_email}
                    onChange={(e) => setSettings({ ...settings, reply_to_email: e.target.value })}
                    placeholder="support@admissionbuddy.co"
                  />
                  <p className="text-xs text-gray-500">Replies will be sent to this address</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email_provider">Email Provider</Label>
                  <select
                    id="email_provider"
                    value={settings.email_provider}
                    onChange={(e) => setSettings({ ...settings, email_provider: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="resend">Resend</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="smtp">Custom SMTP</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary_color">Brand Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      placeholder="#f97316"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Used in email templates for buttons and accents</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={settings.logo_url}
                    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                    placeholder="/assets/main-logo.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footer_text">Email Footer Text</Label>
                <Textarea
                  id="footer_text"
                  value={settings.footer_text}
                  onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                  placeholder="© 2024 admissionbuddy. All rights reserved."
                  rows={2}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                  {saving ? <FiRefreshCw className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>Customize email templates for different scenarios</CardDescription>
                </div>
                <Button variant="outline" onClick={handleResetTemplates}>
                  <FiRefreshCw className="mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.template_key}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        {template.is_active ? (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">Inactive</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Subject: {template.subject}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {template.variables?.map((v) => (
                          <span key={v} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                            {`{{${v}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewTemplate(template.template_key)}
                      >
                        <FiEye className="mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <FiEdit2 className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              Subject: {previewSubject}
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg overflow-auto max-h-[70vh]">
            <iframe
              srcDoc={previewHtml}
              title="Email Preview"
              className="w-full h-[600px] border-0"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Editor Modal */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>
              {editingTemplate?.name}
            </DialogDescription>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Subject Line</Label>
                <Input
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Available variables: {editingTemplate.variables?.map(v => `{{${v}}}`).join(', ')}
                </p>
              </div>

              <div className="space-y-2">
                <Label>HTML Content</Label>
                <Textarea
                  value={editingTemplate.html_content}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, html_content: e.target.value })}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingTemplate.is_active}
                  onCheckedChange={(checked) => setEditingTemplate({ ...editingTemplate, is_active: checked })}
                />
                <Label>Template Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditor(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
                  {saving ? <FiRefreshCw className="animate-spin mr-2" /> : <FiSave className="mr-2" />}
                  Save Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailSettings;
