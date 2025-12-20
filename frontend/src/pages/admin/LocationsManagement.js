import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiMapPin, FiGlobe, FiSearch, FiMove } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const LocationsManagement = () => {
  const [activeTab, setActiveTab] = useState('states');
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image_url: '',
    college_count: 0,
    link: '',
    display_order: 0,
    is_featured: true,
    is_active: true
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const [statesRes, citiesRes, countriesRes] = await Promise.all([
        api.get('/admin/locations/states').catch(() => ({ data: [] })),
        api.get('/admin/locations/cities').catch(() => ({ data: [] })),
        api.get('/admin/locations/countries').catch(() => ({ data: [] }))
      ]);
      setStates(statesRes.data || []);
      setCities(citiesRes.data || []);
      setCountries(countriesRes.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Auto-generate slug from name
      if (name === 'name') {
        const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        college_count: parseInt(formData.college_count) || 0,
        display_order: parseInt(formData.display_order) || 0,
        type: activeTab === 'states' ? 'state' : activeTab === 'cities' ? 'city' : 'country'
      };

      if (editingId) {
        await api.put(`/admin/locations/${editingId}`, payload);
      } else {
        await api.post('/admin/locations', payload);
      }
      
      fetchLocations();
      resetForm();
      alert(editingId ? 'Location updated!' : 'Location added!');
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleEdit = (location) => {
    setFormData({
      name: location.name || '',
      slug: location.slug || '',
      image_url: location.image_url || '',
      college_count: location.college_count || 0,
      link: location.link || '',
      display_order: location.display_order || 0,
      is_featured: location.is_featured !== false,
      is_active: location.is_active !== false
    });
    setEditingId(location.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this location?')) return;
    try {
      await api.delete(`/admin/locations/${id}`);
      fetchLocations();
    } catch (error) {
      alert('Error deleting location');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      image_url: '',
      college_count: 0,
      link: '',
      display_order: 0,
      is_featured: true,
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getCurrentList = () => {
    let list = activeTab === 'states' ? states : activeTab === 'cities' ? cities : countries;
    if (searchTerm) {
      list = list.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return list.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  };

  const getTabLabel = () => {
    return activeTab === 'states' ? 'State' : activeTab === 'cities' ? 'City' : 'Country';
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Locations Management</h1>
            <p className="text-gray-500 text-sm">Manage states, cities, and countries for "Find Colleges by Location"</p>
          </div>
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <FiPlus className="mr-2" /> Add {getTabLabel()}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 'states', label: 'States', icon: FiMapPin },
            { id: 'cities', label: 'Cities', icon: FiMapPin },
            { id: 'streams', label: 'Streams', icon: FiGrid },
            { id: 'courses', label: 'Courses', icon: FiGrid },
            { id: 'countries', label: 'Countries (Study Abroad)', icon: FiGlobe }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} {getTabLabel()}</h2>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full">
                  <FiX size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder={activeTab === 'countries' ? 'USA' : 'Maharashtra'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College Count</label>
                    <input
                      type="number"
                      name="college_count"
                      value={formData.college_count}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      name="display_order"
                      value={formData.display_order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Link (optional)</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="/maharashtra-colleges or leave empty for auto"
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white flex-1">
                    <FiSave className="mr-2" /> Save
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Locations List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : getCurrentList().length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <FiMapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No {activeTab} found. Add your first {getTabLabel().toLowerCase()}!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Order</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Slug</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Colleges</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentList().map((location, idx) => (
                  <tr key={location.id || idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-gray-500 text-sm">{location.display_order || idx + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {location.image_url && (
                          <img src={location.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="font-medium">{location.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{location.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{location.college_count || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {location.is_featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Featured</span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${location.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {location.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(location)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LocationsManagement;
