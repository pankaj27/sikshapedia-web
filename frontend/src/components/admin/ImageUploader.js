import React, { useState } from 'react';
import { FiUpload, FiTrash2, FiCopy, FiLoader } from 'react-icons/fi';
import api from '../../api/axios';

/**
 * Reusable Image Uploader Component
 */
const ImageUploader = ({
  images = [],
  onChange,
  title = 'Images',
  uploadType = 'content',
  collegeName = '',
  maxImages = 10,
  recommendedSize = '800x600',
  compact = false
}) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file) => {
    if (!file || images.length >= maxImages) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post(`/upload/image?type=${uploadType}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newImage = {
        url: response.data.url,
        title: '',
        alt: `${collegeName || 'Image'} - Admissionbuddy`,
        caption: ''
      };
      onChange([...images, newImage]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const updateImage = (index, field, value) => {
    const newImages = [...images];
    newImages[index][field] = value;
    if (field === 'title' && value && !newImages[index].alt) {
      newImages[index].alt = `${value} - ${collegeName || 'College'} - Admissionbuddy`;
    }
    onChange(newImages);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const copyImageHtml = (image) => {
    const html = `<figure>\n  <img src="${image.url}" alt="${image.alt || ''}" title="${image.title || ''}" />\n  ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ''}\n</figure>`;
    navigator.clipboard.writeText(html);
  };

  const copyAllImagesHtml = () => {
    const html = images.map(img => 
      `<figure>\n  <img src="${img.url}" alt="${img.alt || ''}" title="${img.title || ''}" />\n  ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}\n</figure>`
    ).join('\n\n');
    navigator.clipboard.writeText(html);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className={compact ? 'text-xs font-semibold text-gray-700' : 'text-sm font-medium'}>{title}</p>
          <p className="text-xs text-gray-500">Recommended: {recommendedSize}px</p>
        </div>
        <span className="text-xs bg-gray-200 px-2 py-1 rounded">{images.length}/{maxImages} images</span>
      </div>

      {/* Upload Area */}
      {images.length < maxImages && (
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
          <div className="flex flex-col items-center justify-center py-4">
            {uploading ? (
              <FiLoader className="w-6 h-6 text-blue-500 animate-spin" />
            ) : (
              <FiUpload className="w-6 h-6 text-blue-500" />
            )}
            <p className="text-sm text-blue-600 mt-1">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={index} className="bg-white rounded-lg border p-3">
              <div className="flex gap-4">
                {/* Preview */}
                <div className="w-32 h-24 flex-shrink-0">
                  <img
                    src={image.url?.startsWith('/api') ? image.url : `/api${image.url}`}
                    alt={image.alt || 'Image'}
                    className="w-full h-full object-cover rounded border"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/128x96?text=Image'; }}
                  />
                </div>
                
                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={image.title || ''}
                        onChange={(e) => updateImage(index, 'title', e.target.value)}
                        placeholder="Image title"
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Alt Tag (SEO)</label>
                      <input
                        type="text"
                        value={image.alt || ''}
                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                        placeholder="Alt text"
                        className="w-full border-2 border-blue-200 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Caption</label>
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => updateImage(index, 'caption', e.target.value)}
                      placeholder="Optional caption"
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => copyImageHtml(image)}
                    className="p-1 hover:bg-gray-200 rounded text-blue-600"
                    title="Copy HTML"
                  >
                    <FiCopy size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 hover:bg-red-100 rounded text-red-500"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Copy All */}
      {images.length > 1 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={copyAllImagesHtml}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <FiCopy size={12} /> Copy All Images HTML
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
