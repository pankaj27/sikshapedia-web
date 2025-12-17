import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../ui/button';
import CollapsibleSection from '../CollapsibleSection';

const UpdatesSection = ({ formData, availableNews, updateUpdate, addUpdate, removeUpdate }) => {
  return (
    <CollapsibleSection title="Updates & News" icon="📰" defaultOpen={false}>
      <p className="text-sm text-gray-600 mb-4">Add custom news/updates or tag existing news articles from the News page</p>
      
      {formData.updates.map((update, index) => (
        <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
          <div className="grid grid-cols-2 gap-4 mb-3">
            {/* Type Selection */}
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Type *</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`update-type-${index}`}
                    value="custom"
                    checked={update.type === 'custom' || !update.type}
                    onChange={(e) => updateUpdate(index, 'type', e.target.value)}
                    className="mr-2"
                  />
                  Custom News/Update
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`update-type-${index}`}
                    value="tagged"
                    checked={update.type === 'tagged'}
                    onChange={(e) => updateUpdate(index, 'type', e.target.value)}
                    className="mr-2"
                  />
                  Tag from News Page
                </label>
              </div>
            </div>

            {/* If Tagged - Show News Dropdown */}
            {update.type === 'tagged' && (
              <div className="col-span-2">
                <label className="block text-xs text-gray-600 mb-1">Select News Article *</label>
                <select
                  value={update.newsId || ''}
                  onChange={(e) => updateUpdate(index, 'newsId', e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option value="">Select News Article</option>
                  {availableNews.map((news) => (
                    <option key={news.id} value={news.id}>
                      {news.title} ({news.category})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Auto-fills title, content, and date from selected news</p>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Date *</label>
              <input
                type="date"
                value={update.date}
                onChange={(e) => updateUpdate(index, 'date', e.target.value)}
                className="w-full border rounded px-3 py-2"
                readOnly={update.type === 'tagged'}
                style={{backgroundColor: update.type === 'tagged' ? '#fef3c7' : 'white'}}
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs text-gray-600 mb-1">Title *</label>
              <input
                type="text"
                placeholder="News/Update Title"
                value={update.title}
                onChange={(e) => updateUpdate(index, 'title', e.target.value)}
                className="w-full border rounded px-3 py-2"
                readOnly={update.type === 'tagged'}
                style={{backgroundColor: update.type === 'tagged' ? '#fef3c7' : 'white'}}
              />
            </div>

            {/* Content */}
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Content *</label>
              <textarea
                placeholder="News/Update content or summary"
                value={update.content}
                onChange={(e) => updateUpdate(index, 'content', e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="3"
                readOnly={update.type === 'tagged'}
                style={{backgroundColor: update.type === 'tagged' ? '#fef3c7' : 'white'}}
              />
            </div>
          </div>
          
          <Button type="button" variant="outline" onClick={() => removeUpdate(index)} className="mt-2">
            <FiTrash2 className="mr-2" /> Remove Update
          </Button>
        </div>
      ))}
      
      <Button type="button" onClick={addUpdate} size="sm">
        <FiPlus className="mr-2" /> Add Update/News
      </Button>
    </CollapsibleSection>
  );
};

export default UpdatesSection;
