import React, { useRef } from 'react';
import { FiUpload, FiImage, FiVideo, FiPlus, FiTrash2 } from 'react-icons/fi';

/**
 * MediaTab - Reusable media tab for News/Blog forms
 */
const MediaTab = ({
  formData,
  setFormData,
  onImageUpload, // Optional callback for image upload
  showVideo = true,
  showGallery = true
}) => {
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addGalleryImage = () => {
    const newImages = [...(formData.gallery_images || []), { url: '', caption: '' }];
    handleChange('gallery_images', newImages);
  };

  const updateGalleryImage = (index, field, value) => {
    const newImages = [...(formData.gallery_images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    handleChange('gallery_images', newImages);
  };

  const removeGalleryImage = (index) => {
    const newImages = (formData.gallery_images || []).filter((_, i) => i !== index);
    handleChange('gallery_images', newImages);
  };

  return (
    <div className="space-y-6">
      {/* Featured Image */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiImage className="text-orange-500" /> Featured Image
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Image URL *</label>
            <input
              type="url"
              value={formData.featured_image || formData.image || ''}
              onChange={(e) => handleChange('featured_image', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {(formData.featured_image || formData.image) && (
            <div className="relative">
              <img
                src={formData.featured_image || formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Alt Text (for SEO)</label>
            <input
              type="text"
              value={formData.featured_image_alt || ''}
              onChange={(e) => handleChange('featured_image_alt', e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="Descriptive text for the image"
            />
          </div>
        </div>
      </div>

      {/* Video Section */}
      {showVideo && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiVideo className="text-blue-500" /> Video
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Video URL (YouTube/Vimeo)</label>
              <input
                type="url"
                value={formData.video_url || formData.video?.url || ''}
                onChange={(e) => handleChange('video_url', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Video Thumbnail</label>
              <input
                type="url"
                value={formData.video_thumbnail || formData.video?.thumbnail || ''}
                onChange={(e) => handleChange('video_thumbnail', e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {showGallery && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiImage className="text-green-500" /> Image Gallery
            </h3>
            <button
              type="button"
              onClick={addGalleryImage}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
            >
              <FiPlus size={16} /> Add Image
            </button>
          </div>

          {(formData.gallery_images || []).length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No gallery images added yet</p>
          ) : (
            <div className="space-y-3">
              {(formData.gallery_images || []).map((img, index) => (
                <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                  <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {img.url && (
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={img.url}
                      onChange={(e) => updateGalleryImage(index, 'url', e.target.value)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      placeholder="Image URL"
                    />
                    <input
                      type="text"
                      value={img.caption || ''}
                      onChange={(e) => updateGalleryImage(index, 'caption', e.target.value)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      placeholder="Caption (optional)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaTab;
