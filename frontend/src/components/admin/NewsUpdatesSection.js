import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../ui/button';

const NewsUpdatesSection = ({ formData, setFormData, availableNews }) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Link News Articles</label>
        <select
          className="w-full border rounded px-3 py-2 mb-2"
          onChange={(e) => {
            if (e.target.value && !formData.linked_news.includes(e.target.value)) {
              setFormData({
                ...formData,
                linked_news: [...formData.linked_news, e.target.value]
              });
            }
            e.target.value = '';
          }}
        >
          <option value="">Select news article to link...</option>
          {availableNews
            .filter(news => !formData.linked_news.includes(news.id))
            .map(news => (
              <option key={news.id} value={news.id}>{news.title}</option>
            ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {formData.linked_news.map((newsId, index) => {
            const news = availableNews.find(n => n.id === newsId);
            return (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                {news?.title || newsId}
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      linked_news: formData.linked_news.filter((_, i) => i !== index)
                    });
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiTrash2 size={14} />
                </button>
              </span>
            );
          })}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">College Updates</label>
        {formData.updates.map((update, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded mb-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="text"
                placeholder="Update Title"
                value={update.title}
                onChange={(e) => {
                  const newUpdates = [...formData.updates];
                  newUpdates[index] = { ...newUpdates[index], title: e.target.value };
                  setFormData({ ...formData, updates: newUpdates });
                }}
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                value={update.date}
                onChange={(e) => {
                  const newUpdates = [...formData.updates];
                  newUpdates[index] = { ...newUpdates[index], date: e.target.value };
                  setFormData({ ...formData, updates: newUpdates });
                }}
                className="border rounded px-3 py-2"
              />
            </div>
            <textarea
              placeholder="Update Description"
              value={update.description}
              onChange={(e) => {
                const newUpdates = [...formData.updates];
                newUpdates[index] = { ...newUpdates[index], description: e.target.value };
                setFormData({ ...formData, updates: newUpdates });
              }}
              className="w-full border rounded px-3 py-2 mb-2"
              rows={2}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  updates: formData.updates.filter((_, i) => i !== index)
                });
              }}
            >
              <FiTrash2 className="mr-1" /> Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => {
            setFormData({
              ...formData,
              updates: [...formData.updates, { title: '', date: '', description: '' }]
            });
          }}
          size="sm"
        >
          <FiPlus className="mr-2" /> Add Update
        </Button>
      </div>
    </div>
  );
};

export default NewsUpdatesSection;
