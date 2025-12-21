import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiAward, FiCheckCircle, FiStar, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';

const WriteReviewSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Default settings structure
  const defaultSettings = {
    header: {
      title: "Write a Review & Earn ₹300*",
      subtitle: "Share your experience and help thousands of students",
      badge_texts: ["Verified Reviews", "Earn Rewards", "Help Students"]
    },
    points_config: {
      base_points: 50,
      detailed_review_bonus: 50,
      verified_student_bonus: 50,
      photos_bonus: 30,
      min_review_characters: 200
    },
    success_page: {
      title: "Review Submitted Successfully!",
      message: "Thank you for sharing your experience. Your review is being verified and will be published shortly.",
      points_label: "Points Earned!",
      reward_note: "≈ ₹{amount} reward value",
      next_steps_title: "What Happens Next?",
      next_steps: [
        { step_number: 1, text: "Our team will verify your review within 48 hours" },
        { step_number: 2, text: "You'll receive a verification email once approved" },
        { step_number: 3, text: "Points will be added to your account after approval" },
        { step_number: 4, text: "Redeem points for cash via UPI once you have 200+ points" }
      ],
      button_write_another: "Write Another Review",
      button_view_reviews: "View My Reviews"
    },
    benefits_section: {
      title: "Why Write a Review?",
      cards: [
        { title: "Earn Rewards", description: "Get up to ₹300 for every verified review", icon: "award" },
        { title: "Help Students", description: "Guide future students in making informed decisions", icon: "check" },
        { title: "Shape Education", description: "Your feedback helps colleges improve", icon: "star" }
      ]
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/write-review-settings/admin');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await api.put('/write-review-settings', settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to defaults?')) return;
    
    try {
      setSaving(true);
      const response = await api.post('/write-review-settings/reset');
      setSettings(response.data);
      setMessage({ type: 'success', text: 'Settings reset to defaults!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error resetting settings:', error);
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedField = (section, subsection, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const updateNextStep = (index, field, value) => {
    const newSteps = [...settings.success_page.next_steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    updateField('success_page', 'next_steps', newSteps);
  };

  const addNextStep = () => {
    const newSteps = [...settings.success_page.next_steps];
    newSteps.push({ step_number: newSteps.length + 1, text: '' });
    updateField('success_page', 'next_steps', newSteps);
  };

  const removeNextStep = (index) => {
    const newSteps = settings.success_page.next_steps.filter((_, i) => i !== index);
    // Re-number steps
    newSteps.forEach((step, i) => step.step_number = i + 1);
    updateField('success_page', 'next_steps', newSteps);
  };

  const updateBenefitCard = (index, field, value) => {
    const newCards = [...settings.benefits_section.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    updateField('benefits_section', 'cards', newCards);
  };

  const addBenefitCard = () => {
    const newCards = [...settings.benefits_section.cards];
    newCards.push({ title: '', description: '', icon: 'award' });
    updateField('benefits_section', 'cards', newCards);
  };

  const removeBenefitCard = (index) => {
    const newCards = settings.benefits_section.cards.filter((_, i) => i !== index);
    updateField('benefits_section', 'cards', newCards);
  };

  const updateBadgeText = (index, value) => {
    const newBadges = [...settings.header.badge_texts];
    newBadges[index] = value;
    updateField('header', 'badge_texts', newBadges);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Write Review Page Settings</h1>
          <p className="text-gray-600">Manage content and configuration for the Write Review page</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={resetSettings}
            variant="outline"
            disabled={saving}
            className="flex items-center gap-2"
          >
            <FiRefreshCw size={16} />
            Reset to Defaults
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
          >
            <FiSave size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Header Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiEdit2 className="text-orange-500" />
            Header Section
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
              <input
                type="text"
                value={settings.header.title}
                onChange={(e) => updateField('header', 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={settings.header.subtitle}
                onChange={(e) => updateField('header', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge Texts (3 badges)</label>
              <div className="grid grid-cols-3 gap-3">
                {settings.header.badge_texts.map((badge, index) => (
                  <input
                    key={index}
                    type="text"
                    value={badge}
                    onChange={(e) => updateBadgeText(index, e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={`Badge ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Points Configuration */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiAward className="text-orange-500" />
            Points Configuration
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Points</label>
              <input
                type="number"
                value={settings.points_config.base_points}
                onChange={(e) => updateField('points_config', 'base_points', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Points for basic review</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Review Bonus</label>
              <input
                type="number"
                value={settings.points_config.detailed_review_bonus}
                onChange={(e) => updateField('points_config', 'detailed_review_bonus', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">For reviews ≥ min characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Verified Student Bonus</label>
              <input
                type="number"
                value={settings.points_config.verified_student_bonus}
                onChange={(e) => updateField('points_config', 'verified_student_bonus', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">For ID card upload</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photos Bonus</label>
              <input
                type="number"
                value={settings.points_config.photos_bonus}
                onChange={(e) => updateField('points_config', 'photos_bonus', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">For adding photos</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Review Characters</label>
              <input
                type="number"
                value={settings.points_config.min_review_characters}
                onChange={(e) => updateField('points_config', 'min_review_characters', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">Required for detailed bonus</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Max Points Possible:</strong>{' '}
              {settings.points_config.base_points + settings.points_config.detailed_review_bonus + settings.points_config.verified_student_bonus + settings.points_config.photos_bonus} pts
            </p>
          </div>
        </div>

        {/* Success Page Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-green-500" />
            Success Page
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Success Title</label>
                <input
                  type="text"
                  value={settings.success_page.title}
                  onChange={(e) => updateField('success_page', 'title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points Label</label>
                <input
                  type="text"
                  value={settings.success_page.points_label}
                  onChange={(e) => updateField('success_page', 'points_label', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Success Message</label>
              <textarea
                value={settings.success_page.message}
                onChange={(e) => updateField('success_page', 'message', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reward Note</label>
                <input
                  type="text"
                  value={settings.success_page.reward_note}
                  onChange={(e) => updateField('success_page', 'reward_note', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Use {amount} for dynamic value"
                />
                <p className="text-xs text-gray-500 mt-1">Use {'{amount}'} for calculated reward</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Steps Title</label>
                <input
                  type="text"
                  value={settings.success_page.next_steps_title}
                  onChange={(e) => updateField('success_page', 'next_steps_title', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Next Steps</label>
                <Button
                  type="button"
                  onClick={addNextStep}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <FiPlus size={14} /> Add Step
                </Button>
              </div>
              <div className="space-y-2">
                {settings.success_page.next_steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-sm font-bold">
                      {step.step_number}
                    </span>
                    <input
                      type="text"
                      value={step.text}
                      onChange={(e) => updateNextStep(index, 'text', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Step description"
                    />
                    <Button
                      type="button"
                      onClick={() => removeNextStep(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Write Another Button</label>
                <input
                  type="text"
                  value={settings.success_page.button_write_another}
                  onChange={(e) => updateField('success_page', 'button_write_another', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Reviews Button</label>
                <input
                  type="text"
                  value={settings.success_page.button_view_reviews}
                  onChange={(e) => updateField('success_page', 'button_view_reviews', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiStar className="text-yellow-500" />
            Benefits Section ("Why Write a Review?")
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={settings.benefits_section.title}
                onChange={(e) => updateField('benefits_section', 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Benefit Cards</label>
              <Button
                type="button"
                onClick={addBenefitCard}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <FiPlus size={14} /> Add Card
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {settings.benefits_section.cards.map((card, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <Button
                    type="button"
                    onClick={() => removeBenefitCard(index)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={14} />
                  </Button>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                      <select
                        value={card.icon}
                        onChange={(e) => updateBenefitCard(index, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="award">Award 🏆</option>
                        <option value="check">Check ✓</option>
                        <option value="star">Star ⭐</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateBenefitCard(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Benefit title"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        value={card.description}
                        onChange={(e) => updateBenefitCard(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Benefit description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg px-6 py-3"
        >
          <FiSave size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default WriteReviewSettings;
