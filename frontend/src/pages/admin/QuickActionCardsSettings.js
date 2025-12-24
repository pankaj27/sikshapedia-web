import React, { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiTrash2, FiMove, FiEdit3, FiGrid, FiTarget, FiStar, FiBook, FiAward, FiHeart, FiImage, FiEye, FiEyeOff, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import api from '../../api/axios';

const ICON_OPTIONS = [
  { value: 'edit', label: 'Edit/Pencil', icon: FiEdit3 },
  { value: 'grid', label: 'Grid', icon: FiGrid },
  { value: 'target', label: 'Target', icon: FiTarget },
  { value: 'star', label: 'Star', icon: FiStar },
  { value: 'book', label: 'Book', icon: FiBook },
  { value: 'award', label: 'Award', icon: FiAward },
  { value: 'heart', label: 'Heart', icon: FiHeart },
  { value: 'image', label: 'Image', icon: FiImage },
];

const GRADIENT_OPTIONS = [
  { from: 'orange-500', to: 'red-500', label: 'Orange → Red' },
  { from: 'blue-500', to: 'cyan-500', label: 'Blue → Cyan' },
  { from: 'emerald-500', to: 'teal-500', label: 'Green → Teal' },
  { from: 'purple-500', to: 'pink-500', label: 'Purple → Pink' },
  { from: 'yellow-500', to: 'orange-500', label: 'Yellow → Orange' },
  { from: 'indigo-500', to: 'purple-500', label: 'Indigo → Purple' },
  { from: 'rose-500', to: 'red-500', label: 'Rose → Red' },
  { from: 'cyan-500', to: 'blue-500', label: 'Cyan → Blue' },
];

const QuickActionCardsSettings = () => {
  const [settings, setSettings] = useState({
    is_enabled: true,
    cards: [],
    show_on_college_listing: true,
    show_on_school_listing: true,
    show_on_university_listing: true,
    show_on_exam_listing: false,
    show_on_course_listing: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/quick-action-cards-settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/quick-action-cards-settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const addCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Card',
      subtitle: 'Description',
      link: '/',
      icon: 'star',
      gradient_from: 'purple-500',
      gradient_to: 'pink-500',
      is_enabled: true,
      order: settings.cards.length + 1,
      is_ad_slot: false,
      ad_image_url: '',
      ad_click_url: '',
      ad_alt_text: '',
    };
    setSettings({
      ...settings,
      cards: [...settings.cards, newCard]
    });
    setEditingCard(newCard.id);
  };

  const updateCard = (cardId, field, value) => {
    setSettings({
      ...settings,
      cards: settings.cards.map(card => 
        card.id === cardId ? { ...card, [field]: value } : card
      )
    });
  };

  const deleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      setSettings({
        ...settings,
        cards: settings.cards.filter(card => card.id !== cardId)
      });
    }
  };

  const moveCard = (index, direction) => {
    const newCards = [...settings.cards];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newCards.length) return;
    [newCards[index], newCards[newIndex]] = [newCards[newIndex], newCards[index]];
    // Update order values
    newCards.forEach((card, i) => card.order = i + 1);
    setSettings({ ...settings, cards: newCards });
  };

  const getIconComponent = (iconName) => {
    const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : FiStar;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Action Cards</h1>
          <p className="text-gray-600 text-sm mt-1">Manage the action cards shown on listing pages (Write Review, Course Finder, Predictor)</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          <FiSave size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Global Toggle */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Enable Quick Action Cards</h2>
            <p className="text-sm text-gray-500">Show/hide the entire quick action cards section</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.is_enabled}
              onChange={(e) => setSettings({ ...settings, is_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Page Visibility Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Show On Pages</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { key: 'show_on_college_listing', label: 'College Listing' },
            { key: 'show_on_school_listing', label: 'School Listing' },
            { key: 'show_on_university_listing', label: 'University Listing' },
            { key: 'show_on_exam_listing', label: 'Exam Listing' },
            { key: 'show_on_course_listing', label: 'Course Listing' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Action Cards ({settings.cards.length})</h2>
          <button
            onClick={addCard}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            <FiPlus size={16} />
            Add Card
          </button>
        </div>

        {/* Live Preview */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-500 mb-3 font-medium">LIVE PREVIEW</p>
          <div className="grid grid-cols-3 gap-3">
            {settings.cards.filter(c => c.is_enabled).sort((a, b) => a.order - b.order).map(card => {
              const IconComponent = getIconComponent(card.icon);
              
              if (card.is_ad_slot && card.ad_image_url) {
                return (
                  <a key={card.id} href={card.ad_click_url || '#'} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="rounded-xl overflow-hidden h-full">
                      <img src={card.ad_image_url} alt={card.ad_alt_text || 'Advertisement'} className="w-full h-20 object-cover" />
                    </div>
                  </a>
                );
              }
              
              return (
                <div key={card.id} className={`bg-gradient-to-br from-${card.gradient_from} to-${card.gradient_to} rounded-xl p-3 text-white`}>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <IconComponent className="text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{card.title}</h3>
                      <p className="text-xs opacity-80">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cards Editor */}
        <div className="space-y-4">
          {settings.cards.sort((a, b) => a.order - b.order).map((card, index) => (
            <div key={card.id} className={`border-2 rounded-xl overflow-hidden ${editingCard === card.id ? 'border-blue-400' : 'border-gray-200'}`}>
              {/* Card Header */}
              <div className={`px-4 py-3 flex items-center justify-between ${card.is_enabled ? 'bg-gray-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveCard(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                      <FiChevronUp size={14} />
                    </button>
                    <button onClick={() => moveCard(index, 'down')} disabled={index === settings.cards.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                      <FiChevronDown size={14} />
                    </button>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-br from-${card.gradient_from} to-${card.gradient_to} rounded-lg flex items-center justify-center text-white`}>
                    {React.createElement(getIconComponent(card.icon), { size: 20 })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    <p className="text-xs text-gray-500">{card.is_ad_slot ? '📢 Advertisement Slot' : `🔗 ${card.link}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCard(card.id, 'is_enabled', !card.is_enabled)}
                    className={`p-2 rounded-lg ${card.is_enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                    title={card.is_enabled ? 'Enabled' : 'Disabled'}
                  >
                    {card.is_enabled ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => setEditingCard(editingCard === card.id ? null : card.id)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    <FiEdit3 size={18} />
                  </button>
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Card Editor (Expanded) */}
              {editingCard === card.id && (
                <div className="p-4 bg-white border-t space-y-4">
                  {/* Card Type Toggle */}
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!card.is_ad_slot}
                        onChange={() => updateCard(card.id, 'is_ad_slot', false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">Action Card</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={card.is_ad_slot}
                        onChange={() => updateCard(card.id, 'is_ad_slot', true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm font-medium">📢 Advertisement Slot</span>
                    </label>
                  </div>

                  {card.is_ad_slot ? (
                    /* Advertisement Settings */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ad Image URL</label>
                        <input
                          type="text"
                          value={card.ad_image_url || ''}
                          onChange={(e) => updateCard(card.id, 'ad_image_url', e.target.value)}
                          placeholder="https://example.com/ad-image.jpg"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Click URL</label>
                        <input
                          type="text"
                          value={card.ad_click_url || ''}
                          onChange={(e) => updateCard(card.id, 'ad_click_url', e.target.value)}
                          placeholder="https://example.com/landing-page"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (SEO)</label>
                        <input
                          type="text"
                          value={card.ad_alt_text || ''}
                          onChange={(e) => updateCard(card.id, 'ad_alt_text', e.target.value)}
                          placeholder="Advertisement description"
                          className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Action Card Settings */
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={card.subtitle}
                            onChange={(e) => updateCard(card.id, 'subtitle', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                          <input
                            type="text"
                            value={card.link}
                            onChange={(e) => updateCard(card.id, 'link', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                          <select
                            value={card.icon}
                            onChange={(e) => updateCard(card.id, 'icon', e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                          >
                            {ICON_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Gradient Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                          {GRADIENT_OPTIONS.map(grad => (
                            <button
                              key={`${grad.from}-${grad.to}`}
                              onClick={() => {
                                updateCard(card.id, 'gradient_from', grad.from);
                                updateCard(card.id, 'gradient_to', grad.to);
                              }}
                              className={`h-10 rounded-lg bg-gradient-to-br from-${grad.from} to-${grad.to} ${
                                card.gradient_from === grad.from && card.gradient_to === grad.to
                                  ? 'ring-2 ring-offset-2 ring-blue-500'
                                  : ''
                              }`}
                              title={grad.label}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}

          {settings.cards.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <p className="text-gray-400 mb-4">No cards configured yet</p>
              <button onClick={addCard} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                Add Your First Card
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickActionCardsSettings;
