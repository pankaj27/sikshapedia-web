import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiBarChart2, FiEye, FiMousePointer, FiUpload, FiMinimize2, FiMaximize2, FiTarget } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import api from '../../api/axios';

const AdvertisementsManagement = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    ad_type: 'banner',
    image_url: '',
    link_url: '',
    open_in_new_tab: true,
    pages: [],
    custom_urls: [], // Custom URL targeting
    position: 'top',
    start_date: '',
    end_date: '',
    start_time: '00:00',
    end_time: '23:59',
    is_active: true,
    priority: 0,
    max_impressions_per_user: null,
    // Banner specific
    banner_size: '728x90',
    // Video specific
    video_url: '',
    video_thumbnail: '',
    // HTML/Native specific
    html_content: '',
    // Budget & Billing
    budget: {
      total_budget: 0,
      daily_budget: 0,
      cost_per_click: 0,
      cost_per_impression: 0,
      spent_total: 0,
      spent_today: 0
    },
    // Ad Rotation
    rotation: {
      enabled: false,
      max_impressions: 0,
      max_clicks: 0,
      rotation_type: 'sequential',
      weight: 1
    }
  });
  const [newCustomUrl, setNewCustomUrl] = useState('');

  const availablePages = [
    { value: 'colleges', label: 'Colleges Listing' },
    { value: 'college-detail', label: 'College Detail' },
    { value: 'course-detail', label: 'Course Detail' },
    { value: 'exams', label: 'Exams Listing' },
    { value: 'news', label: 'News' },
    { value: 'schools', label: 'Schools Listing' },
    { value: 'universities', label: 'Universities Listing' },
    { value: 'courses', label: 'Courses Listing' },
    { value: 'compare', label: 'Compare' },
    { value: 'home', label: 'Home Page' },
    { value: 'scholarships', label: 'Scholarships' },
    { value: 'loans', label: 'Education Loans' },
  ];

  const bannerSizes = [
    { value: '728x90', label: 'Leaderboard (728x90)' },
    { value: '300x250', label: 'Medium Rectangle (300x250)' },
    { value: '160x600', label: 'Wide Skyscraper (160x600)' },
    { value: '320x50', label: 'Mobile Banner (320x50)' },
    { value: '300x600', label: 'Half Page (300x600)' },
    { value: '970x250', label: 'Billboard (970x250)' },
  ];

  const adTypes = [
    { value: 'banner', label: 'Banner Ad', icon: '🖼️' },
    { value: 'text', label: 'Text Ad', icon: '📝' },
    { value: 'video', label: 'Video Ad', icon: '🎬' },
    { value: 'html', label: 'HTML/Native Ad', icon: '💻' },
  ];

  const availablePositions = [
    { value: 'top', label: 'Top Banner', description: 'Above page content', recommended: '1920x200' },
    { value: 'content-top', label: 'Content Top', description: 'Inside main content area (top)', recommended: '728x90' },
    { value: 'content-middle', label: 'Content Middle', description: 'Middle of main content area', recommended: '728x90' },
    { value: 'content-bottom', label: 'Content Bottom', description: 'Inside main content area (bottom)', recommended: '728x90' },
    { value: 'sidebar', label: 'Sidebar', description: 'Right sidebar area', recommended: '300x250' },
    { value: 'popup', label: 'Popup', description: 'Overlay popup', recommended: '600x400' },
    { value: 'floating', label: 'Floating', description: 'Fixed floating banner', recommended: '320x100' },
    { value: 'homepage-hero', label: 'Homepage Hero', description: 'Main hero slider', recommended: '1920x600' },
    { value: 'footer', label: 'Footer Banner', description: 'Page footer area', recommended: '1920x150' },
    { value: 'mobile', label: 'Mobile Banner', description: 'Mobile-optimized', recommended: '320x100' },
  ];

  // Image Upload States
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageSize, setOriginalImageSize] = useState(null);
  const [compressedImageSize, setCompressedImageSize] = useState(null);
  const [resizeWidth, setResizeWidth] = useState('');
  const [resizeHeight, setResizeHeight] = useState('');
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [showImageTools, setShowImageTools] = useState(false);
  const imageInputRef = useRef(null);

  // Get recommended size for selected position
  const getRecommendedSize = useCallback(() => {
    const pos = availablePositions.find(p => p.value === formData.position);
    return pos?.recommended || '728x90';
  }, [formData.position]);

  // Image compression function
  const compressImage = useCallback((file, quality = 80, maxWidth = null, maxHeight = null) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (maxWidth && width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (maxHeight && height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  blob,
                  width,
                  height,
                  size: blob.size,
                  dataUrl: canvas.toDataURL('image/jpeg', quality / 100)
                });
              } else {
                reject(new Error('Failed to compress'));
              }
            },
            'image/jpeg',
            quality / 100
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }, []);

  // Handle image file selection
  const handleImageSelect = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setImageFile(file);
    setOriginalImageSize({ size: file.size, name: file.name });

    const img = new Image();
    img.onload = () => {
      setOriginalImageSize(prev => ({ ...prev, width: img.width, height: img.height }));
      setResizeWidth(img.width.toString());
      setResizeHeight(img.height.toString());
    };
    img.src = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setShowImageTools(true);
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) handleImageSelect(files[0]);
  }, [handleImageSelect]);

  // Apply compression and resize
  const applyImageProcessing = useCallback(async () => {
    if (!imageFile) return;
    setImageUploading(true);
    try {
      const width = resizeWidth ? parseInt(resizeWidth) : null;
      const height = resizeHeight ? parseInt(resizeHeight) : null;
      const result = await compressImage(imageFile, compressionQuality, width, height);
      
      setCompressedImageSize({ size: result.size, width: result.width, height: result.height });
      setImagePreview(result.dataUrl);
      setImageFile(new File([result.blob], imageFile.name, { type: 'image/jpeg' }));
    } catch (error) {
      alert('Failed to process image');
    } finally {
      setImageUploading(false);
    }
  }, [imageFile, resizeWidth, resizeHeight, compressionQuality, compressImage]);

  // Upload image to server
  const uploadImage = useCallback(async () => {
    if (!imageFile) return;
    setImageUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);

      // Get admin token
      const token = localStorage.getItem('adminToken');
      
      const response = await api.post('/upload/image?type=banner', uploadFormData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data?.url) {
        // Make sure we have a full URL
        let uploadedUrl = response.data.url;
        if (uploadedUrl.startsWith('/')) {
          // Convert relative URL to absolute using the backend URL
          const backendUrl = process.env.REACT_APP_BACKEND_URL || '';
          uploadedUrl = backendUrl + uploadedUrl;
        }
        setFormData(prev => ({ ...prev, image_url: uploadedUrl }));
        setShowImageTools(false);
        setImageFile(null);
        setImagePreview(null);
        setOriginalImageSize(null);
        setCompressedImageSize(null);
        console.log('Image uploaded successfully:', uploadedUrl);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  }, [imageFile]);

  // Apply recommended size
  const applyRecommendedSize = useCallback(() => {
    const size = getRecommendedSize();
    const [width, height] = size.split('x');
    setResizeWidth(width);
    setResizeHeight(height);
  }, [getRecommendedSize]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setLoading(true);
    try {
      const response = await api.get('/advertisements');
      setAdvertisements(response.data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      alert('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAd) {
        await api.put(`/advertisements/${editingAd.id}`, formData);
        alert('Advertisement updated successfully!');
      } else {
        await api.post('/advertisements', formData);
        alert('Advertisement created successfully!');
      }
      setShowForm(false);
      setEditingAd(null);
      resetForm();
      fetchAdvertisements();
    } catch (error) {
      console.error('Error saving advertisement:', error);
      alert(`Failed to save advertisement: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      name: ad.name,
      title: ad.title || '',
      description: ad.description || '',
      ad_type: ad.ad_type,
      image_url: ad.image_url,
      link_url: ad.link_url,
      open_in_new_tab: ad.open_in_new_tab,
      pages: ad.pages || [],
      position: ad.position,
      start_date: ad.start_date ? ad.start_date.substring(0, 16) : '',
      end_date: ad.end_date ? ad.end_date.substring(0, 16) : '',
      is_active: ad.is_active,
      priority: ad.priority || 0,
      max_impressions_per_user: ad.max_impressions_per_user
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        await api.delete(`/advertisements/${id}`);
        alert('Advertisement deleted successfully!');
        fetchAdvertisements();
      } catch (error) {
        console.error('Error deleting advertisement:', error);
        alert('Failed to delete advertisement');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      ad_type: 'banner',
      image_url: '',
      link_url: '',
      open_in_new_tab: true,
      pages: [],
      position: 'top',
      start_date: '',
      end_date: '',
      is_active: true,
      priority: 0,
      max_impressions_per_user: null
    });
  };

  const handlePageToggle = (pageValue) => {
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.includes(pageValue)
        ? prev.pages.filter(p => p !== pageValue)
        : [...prev.pages, pageValue]
    }));
  };

  const isAdActive = (ad) => {
    const now = new Date();
    const start = new Date(ad.start_date);
    const end = new Date(ad.end_date);
    return ad.is_active && start <= now && now <= end;
  };

  const filteredAds = advertisements.filter(ad =>
    ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Advertisement Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => window.location.href = '/admin/advertisements/reports'}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FiBarChart2 /> View Reports
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setEditingAd(null);
              setShowForm(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 flex items-center gap-2"
          >
            <FiPlus /> Create Advertisement
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search advertisements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Advertisements Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pages</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAds.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No advertisements found. Create your first ad campaign!
                </td>
              </tr>
            ) : (
              filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {ad.image_url && (
                        <img
                          src={ad.image_url}
                          alt={ad.name}
                          className="h-12 w-20 object-cover rounded mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ad.name}</div>
                        {ad.title && <div className="text-xs text-gray-500">{ad.title}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {ad.ad_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500">
                      {ad.pages?.slice(0, 2).join(', ')}
                      {ad.pages?.length > 2 && ` +${ad.pages.length - 2}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <div>{new Date(ad.start_date).toLocaleDateString()}</div>
                    <div>to {new Date(ad.end_date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <FiEye className="text-blue-500" />
                        <span>{ad.impressions || 0} impressions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiMousePointer className="text-green-500" />
                        <span>{ad.clicks || 0} clicks</span>
                      </div>
                      {ad.impressions > 0 && (
                        <div className="text-gray-600">
                          CTR: {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isAdActive(ad)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isAdActive(ad) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ad)}
                      className="mr-2"
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ad.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Campaign Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Display Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Ad Type *</label>
                    <select
                      value={formData.ad_type}
                      onChange={(e) => setFormData({ ...formData, ad_type: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="banner">🖼️ Banner Ad</option>
                      <option value="text">📝 Text Ad</option>
                      <option value="video">🎬 Video Ad</option>
                      <option value="html">💻 HTML/Native Ad</option>
                      <option value="popup">📢 Popup</option>
                      <option value="sidebar">📌 Sidebar</option>
                      <option value="floating">🎈 Floating</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Banner Image *</label>
                    
                    {/* Upload Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors mb-3"
                    >
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && handleImageSelect(e.target.files[0])}
                        className="hidden"
                      />
                      <FiUpload className="mx-auto text-gray-400 mb-1" size={24} />
                      <p className="text-sm text-gray-600">
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>

                    {/* Image Tools */}
                    {showImageTools && imagePreview && (
                      <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                        {/* Preview & Info */}
                        <div className="flex gap-4">
                          <img src={imagePreview} alt="Preview" className="max-h-24 rounded border" />
                          <div className="text-xs text-gray-600">
                            {originalImageSize && (
                              <>
                                <p>📁 {originalImageSize.name}</p>
                                <p>📐 {originalImageSize.width} × {originalImageSize.height} px</p>
                                <p>💾 {formatFileSize(originalImageSize.size)}</p>
                                {compressedImageSize && (
                                  <p className="text-green-600 mt-1">
                                    ✅ Processed: {compressedImageSize.width}×{compressedImageSize.height} ({formatFileSize(compressedImageSize.size)})
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Recommended Size Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded p-2 flex items-center justify-between">
                          <span className="text-xs text-blue-700">
                            <FiTarget className="inline mr-1" size={12} />
                            Recommended: <strong>{getRecommendedSize()}</strong> px for {availablePositions.find(p => p.value === formData.position)?.label}
                          </span>
                          <Button type="button" variant="outline" size="sm" onClick={applyRecommendedSize} className="text-xs h-6 px-2">
                            Use This
                          </Button>
                        </div>

                        {/* Resize */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
                            <input
                              type="number"
                              value={resizeWidth}
                              onChange={(e) => setResizeWidth(e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
                            <input
                              type="number"
                              value={resizeHeight}
                              onChange={(e) => setResizeHeight(e.target.value)}
                              className="w-full border rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Compression */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Quality: {compressionQuality}%
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={compressionQuality}
                            onChange={(e) => setCompressionQuality(parseInt(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Smaller file</span>
                            <span>Higher quality</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={applyImageProcessing} disabled={imageUploading} className="flex-1">
                            {imageUploading ? 'Processing...' : '🔄 Apply'}
                          </Button>
                          <Button type="button" size="sm" onClick={uploadImage} disabled={imageUploading} className="flex-1 bg-blue-600 hover:bg-blue-700">
                            {imageUploading ? 'Uploading...' : '⬆️ Upload'}
                          </Button>
                        </div>

                        <button
                          type="button"
                          onClick={() => { setShowImageTools(false); setImageFile(null); setImagePreview(null); }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    )}

                    {/* Or URL */}
                    <div className="flex items-center gap-2 my-2">
                      <div className="flex-1 border-t"></div>
                      <span className="text-xs text-gray-400">or enter URL</span>
                      <div className="flex-1 border-t"></div>
                    </div>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className={`w-full border rounded px-3 py-2 ${formData.image_url ? 'border-green-400 bg-green-50' : ''}`}
                      placeholder="https://example.com/ad-image.jpg"
                    />
                    {formData.image_url && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                        <p className="text-xs text-green-700 font-medium mb-1">✅ Image URL Set:</p>
                        <p className="text-xs text-green-600 break-all">{formData.image_url}</p>
                        <div className="mt-2">
                          <img 
                            src={formData.image_url} 
                            alt="Preview" 
                            className="max-h-24 rounded border"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Position-wise Size Reference */}
                  <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-xs font-medium text-yellow-800 mb-2">📐 Recommended Image Sizes by Position:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs text-yellow-700">
                      {availablePositions.map(p => (
                        <div key={p.value} className="flex justify-between">
                          <span>{p.label}:</span>
                          <span className="font-mono">{p.recommended}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Link URL *</label>
                    <input
                      type="url"
                      value={formData.link_url}
                      onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="https://example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Position *</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      {availablePositions.map(pos => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label} ({pos.recommended}) - {pos.description}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select position • Recommended size: <strong>{getRecommendedSize()}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-full border rounded px-3 py-2"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Higher priority ads show first</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">End Date *</label>
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">Show on Pages *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availablePages.map(page => (
                        <label key={page.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.pages.includes(page.value)}
                            onChange={() => handlePageToggle(page.value)}
                            className="rounded"
                          />
                          <span className="text-sm">{page.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.open_in_new_tab}
                        onChange={(e) => setFormData({ ...formData, open_in_new_tab: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Open link in new tab</span>
                    </label>
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Active</span>
                    </label>
                  </div>

                  {/* Custom URL Targeting */}
                  <div className="col-span-2 bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">🔗 Link-wise Targeting (Custom URLs)</h3>
                    <p className="text-xs text-gray-600 mb-2">Add specific URLs where this ad should appear (in addition to page types selected above)</p>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newCustomUrl}
                        onChange={(e) => setNewCustomUrl(e.target.value)}
                        className="flex-1 border rounded px-3 py-2 text-sm"
                        placeholder="/maharashtra-colleges or /colleges?city=Mumbai"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (newCustomUrl && !formData.custom_urls?.includes(newCustomUrl)) {
                            setFormData({ ...formData, custom_urls: [...(formData.custom_urls || []), newCustomUrl] });
                            setNewCustomUrl('');
                          }
                        }}
                      >
                        Add URL
                      </Button>
                    </div>
                    {formData.custom_urls?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.custom_urls.map((url, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm flex items-center gap-1">
                            {url}
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, custom_urls: formData.custom_urls.filter(u => u !== url) })}
                              className="text-purple-500 hover:text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Budget & Billing */}
                  <div className="col-span-2 bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-800 mb-2">💰 Budget & Billing</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-medium mb-1">Total Budget (₹)</label>
                        <input
                          type="number"
                          value={formData.budget?.total_budget || 0}
                          onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, total_budget: parseFloat(e.target.value) || 0 } })}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min="0"
                          placeholder="0 = unlimited"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Daily Budget (₹)</label>
                        <input
                          type="number"
                          value={formData.budget?.daily_budget || 0}
                          onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, daily_budget: parseFloat(e.target.value) || 0 } })}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">CPC (₹ per click)</label>
                        <input
                          type="number"
                          value={formData.budget?.cost_per_click || 0}
                          onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, cost_per_click: parseFloat(e.target.value) || 0 } })}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">CPM (₹ per 1000 views)</label>
                        <input
                          type="number"
                          value={formData.budget?.cost_per_impression || 0}
                          onChange={(e) => setFormData({ ...formData, budget: { ...formData.budget, cost_per_impression: parseFloat(e.target.value) || 0 } })}
                          className="w-full border rounded px-2 py-1 text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ad Rotation */}
                  <div className="col-span-2 bg-cyan-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-cyan-800">🔄 Ad Rotation</h3>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rotation?.enabled || false}
                          onChange={(e) => setFormData({ ...formData, rotation: { ...formData.rotation, enabled: e.target.checked } })}
                          className="rounded"
                        />
                        <span className="text-sm">Enable Rotation</span>
                      </label>
                    </div>
                    {formData.rotation?.enabled && (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1">Max Impressions</label>
                          <input
                            type="number"
                            value={formData.rotation?.max_impressions || 0}
                            onChange={(e) => setFormData({ ...formData, rotation: { ...formData.rotation, max_impressions: parseInt(e.target.value) || 0 } })}
                            className="w-full border rounded px-2 py-1 text-sm"
                            min="0"
                            placeholder="0 = unlimited"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Max Clicks</label>
                          <input
                            type="number"
                            value={formData.rotation?.max_clicks || 0}
                            onChange={(e) => setFormData({ ...formData, rotation: { ...formData.rotation, max_clicks: parseInt(e.target.value) || 0 } })}
                            className="w-full border rounded px-2 py-1 text-sm"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Rotation Type</label>
                          <select
                            value={formData.rotation?.rotation_type || 'sequential'}
                            onChange={(e) => setFormData({ ...formData, rotation: { ...formData.rotation, rotation_type: e.target.value } })}
                            className="w-full border rounded px-2 py-1 text-sm"
                          >
                            <option value="sequential">Sequential</option>
                            <option value="random">Random</option>
                            <option value="weighted">Weighted</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Ad Fields */}
                  {formData.ad_type === 'video' && (
                    <div className="col-span-2 bg-red-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-2">🎬 Video Ad Settings</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1">Video URL *</label>
                          <input
                            type="url"
                            value={formData.video_url || ''}
                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                            className="w-full border rounded px-2 py-1 text-sm"
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Thumbnail URL</label>
                          <input
                            type="url"
                            value={formData.video_thumbnail || ''}
                            onChange={(e) => setFormData({ ...formData, video_thumbnail: e.target.value })}
                            className="w-full border rounded px-2 py-1 text-sm"
                            placeholder="https://example.com/thumb.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HTML/Native Ad Fields */}
                  {formData.ad_type === 'html' && (
                    <div className="col-span-2 bg-indigo-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-indigo-800 mb-2">💻 HTML/Native Ad Content</h3>
                      <textarea
                        value={formData.html_content || ''}
                        onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm font-mono"
                        rows={6}
                        placeholder="<div>Your HTML ad code here</div>"
                      />
                    </div>
                  )}

                  {/* Banner Size (for banner type) */}
                  {formData.ad_type === 'banner' && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Banner Size</label>
                      <select
                        value={formData.banner_size || '728x90'}
                        onChange={(e) => setFormData({ ...formData, banner_size: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                      >
                        {bannerSizes.map(size => (
                          <option key={size.value} value={size.value}>{size.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAd(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                    {editingAd ? 'Update' : 'Create'} Advertisement
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementsManagement;
