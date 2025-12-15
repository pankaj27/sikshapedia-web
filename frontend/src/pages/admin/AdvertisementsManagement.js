import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiBarChart2, FiEye, FiMousePointer } from 'react-icons/fi';
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
    position: 'top',
    start_date: '',
    end_date: '',
    is_active: true,
    priority: 0,
    max_impressions_per_user: null
  });

  const availablePages = [
    { value: 'home', label: 'Home Page' },
    { value: 'colleges', label: 'Colleges Listing' },
    { value: 'college-detail', label: 'College Detail' },
    { value: 'schools', label: 'Schools Listing' },
    { value: 'universities', label: 'Universities Listing' },
    { value: 'courses', label: 'Courses' },
    { value: 'exams', label: 'Exams' },
    { value: 'news', label: 'News' },
    { value: 'compare', label: 'Compare' },
  ];

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
                      <option value="banner">Banner</option>
                      <option value="popup">Popup</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="floating">Floating</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Image URL *</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      placeholder="https://example.com/ad-image.jpg"
                      required
                    />
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
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="sidebar">Sidebar</option>
                      <option value="popup">Popup</option>
                    </select>
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
