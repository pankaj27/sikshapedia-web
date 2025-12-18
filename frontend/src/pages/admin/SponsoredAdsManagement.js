import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiCheckCircle, FiCalendar, FiMove, FiTrash2, FiPlus, FiSave, FiSearch, FiX } from 'react-icons/fi';
import api from '../../services/api';
import { Button } from '../../components/ui/button';

const SponsoredAdsManagement = () => {
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [admissionOpenColleges, setAdmissionOpenColleges] = useState([]);
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(null); // 'featured' or 'admission_open'
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sponsored ads config
      const configRes = await api.get('/sponsored-ads');
      if (configRes.data) {
        setFeaturedColleges(configRes.data.featured_colleges || []);
        setAdmissionOpenColleges(configRes.data.admission_open_colleges || []);
      }
      
      // Fetch all colleges for selection
      const collegesRes = await api.get('/colleges?limit=500');
      setAllColleges(collegesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    const results = allColleges.filter(c => 
      c.name?.toLowerCase().includes(query.toLowerCase()) ||
      c.location?.city?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
    setSearchResults(results);
  };

  const addCollege = (college, type) => {
    const newEntry = {
      college_id: college.id,
      college_name: college.name,
      college_logo: college.logo_url,
      college_location: `${college.location?.city || ''}, ${college.location?.state || ''}`,
      college_type: college.type,
      college_nirf: college.nirf_ranking,
      college_rating: college.rating,
      college_fees: college.average_fees,
      serial_order: type === 'featured' ? featuredColleges.length + 1 : admissionOpenColleges.length + 1,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 days default
      is_active: true
    };

    if (type === 'featured') {
      // Check if already exists
      if (featuredColleges.some(f => f.college_id === college.id)) {
        alert('This college is already in the Featured list');
        return;
      }
      setFeaturedColleges([...featuredColleges, newEntry]);
    } else {
      if (admissionOpenColleges.some(a => a.college_id === college.id)) {
        alert('This college is already in the Admissions Open list');
        return;
      }
      setAdmissionOpenColleges([...admissionOpenColleges, newEntry]);
    }
    
    setShowAddModal(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeCollege = (index, type) => {
    if (type === 'featured') {
      const updated = featuredColleges.filter((_, i) => i !== index);
      // Reorder serials
      updated.forEach((c, i) => c.serial_order = i + 1);
      setFeaturedColleges(updated);
    } else {
      const updated = admissionOpenColleges.filter((_, i) => i !== index);
      updated.forEach((c, i) => c.serial_order = i + 1);
      setAdmissionOpenColleges(updated);
    }
  };

  const updateCollege = (index, field, value, type) => {
    if (type === 'featured') {
      const updated = [...featuredColleges];
      updated[index][field] = value;
      setFeaturedColleges(updated);
    } else {
      const updated = [...admissionOpenColleges];
      updated[index][field] = value;
      setAdmissionOpenColleges(updated);
    }
  };

  const moveCollege = (index, direction, type) => {
    const list = type === 'featured' ? [...featuredColleges] : [...admissionOpenColleges];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= list.length) return;
    
    // Swap
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    
    // Update serial orders
    list.forEach((c, i) => c.serial_order = i + 1);
    
    if (type === 'featured') {
      setFeaturedColleges(list);
    } else {
      setAdmissionOpenColleges(list);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/sponsored-ads', {
        featured_colleges: featuredColleges,
        admission_open_colleges: admissionOpenColleges
      });
      alert('Sponsored ads saved successfully!');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving sponsored ads');
    } finally {
      setSaving(false);
    }
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  const isActive = (entry) => {
    const now = new Date();
    const start = new Date(entry.start_date);
    const end = new Date(entry.end_date);
    return entry.is_active && now >= start && now <= end;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 hover:bg-gray-200 rounded-lg">
            <FiArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sponsored Ads Management</h1>
            <p className="text-sm text-gray-500">Manage Featured & Admissions Open sections on listing pages</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
          <FiSave className="mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Colleges Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <FiStar className="fill-current" />
              <span className="font-bold">Featured Colleges</span>
              <span className="text-orange-100 text-sm">({featuredColleges.length} colleges)</span>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowAddModal('featured')}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <FiPlus className="mr-1" /> Add
            </Button>
          </div>
          
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {featuredColleges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiStar size={40} className="mx-auto mb-2 text-gray-300" />
                <p>No featured colleges added yet</p>
                <p className="text-sm">Click "Add" to add colleges</p>
              </div>
            ) : (
              featuredColleges.map((college, idx) => (
                <div 
                  key={college.college_id} 
                  className={`border rounded-lg p-3 ${
                    isActive(college) ? 'border-green-300 bg-green-50' : 
                    isExpired(college.end_date) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Serial & Move Buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {college.serial_order}
                      </span>
                      <button 
                        onClick={() => moveCollege(idx, 'up', 'featured')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => moveCollege(idx, 'down', 'featured')}
                        disabled={idx === featuredColleges.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    
                    {/* College Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{college.college_name}</h4>
                      <p className="text-xs text-gray-500">{college.college_location}</p>
                      
                      {/* Date Controls */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="text-xs text-gray-500">Start Date</label>
                          <input
                            type="date"
                            value={college.start_date}
                            onChange={(e) => updateCollege(idx, 'start_date', e.target.value, 'featured')}
                            className="w-full text-xs border rounded px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">End Date</label>
                          <input
                            type="date"
                            value={college.end_date}
                            onChange={(e) => updateCollege(idx, 'end_date', e.target.value, 'featured')}
                            className="w-full text-xs border rounded px-2 py-1"
                          />
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center gap-2 mt-2">
                        <label className="flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={college.is_active}
                            onChange={(e) => updateCollege(idx, 'is_active', e.target.checked, 'featured')}
                            className="rounded"
                          />
                          Active
                        </label>
                        {isActive(college) && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Live Now</span>
                        )}
                        {isExpired(college.end_date) && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Expired</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeCollege(idx, 'featured')}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admissions Open Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <FiCheckCircle />
              <span className="font-bold">Admissions Open 2025</span>
              <span className="text-green-100 text-sm">({admissionOpenColleges.length} colleges)</span>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowAddModal('admission_open')}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <FiPlus className="mr-1" /> Add
            </Button>
          </div>
          
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {admissionOpenColleges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiCheckCircle size={40} className="mx-auto mb-2 text-gray-300" />
                <p>No admission open colleges added yet</p>
                <p className="text-sm">Click "Add" to add colleges</p>
              </div>
            ) : (
              admissionOpenColleges.map((college, idx) => (
                <div 
                  key={college.college_id} 
                  className={`border rounded-lg p-3 ${
                    isActive(college) ? 'border-green-300 bg-green-50' : 
                    isExpired(college.end_date) ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Serial & Move Buttons */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {college.serial_order}
                      </span>
                      <button 
                        onClick={() => moveCollege(idx, 'up', 'admission_open')}
                        disabled={idx === 0}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button 
                        onClick={() => moveCollege(idx, 'down', 'admission_open')}
                        disabled={idx === admissionOpenColleges.length - 1}
                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    
                    {/* College Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">{college.college_name}</h4>
                      <p className="text-xs text-gray-500">{college.college_location}</p>
                      
                      {/* Date Controls */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="text-xs text-gray-500">Start Date</label>
                          <input
                            type="date"
                            value={college.start_date}
                            onChange={(e) => updateCollege(idx, 'start_date', e.target.value, 'admission_open')}
                            className="w-full text-xs border rounded px-2 py-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">End Date</label>
                          <input
                            type="date"
                            value={college.end_date}
                            onChange={(e) => updateCollege(idx, 'end_date', e.target.value, 'admission_open')}
                            className="w-full text-xs border rounded px-2 py-1"
                          />
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex items-center gap-2 mt-2">
                        <label className="flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={college.is_active}
                            onChange={(e) => updateCollege(idx, 'is_active', e.target.checked, 'admission_open')}
                            className="rounded"
                          />
                          Active
                        </label>
                        {isActive(college) && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Live Now</span>
                        )}
                        {isExpired(college.end_date) && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Expired</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => removeCollege(idx, 'admission_open')}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add College Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className={`px-4 py-3 rounded-t-xl flex items-center justify-between ${
              showAddModal === 'featured' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                : 'bg-gradient-to-r from-green-600 to-emerald-600'
            }`}>
              <h3 className="font-bold text-white">
                Add to {showAddModal === 'featured' ? 'Featured Colleges' : 'Admissions Open'}
              </h3>
              <button onClick={() => { setShowAddModal(null); setSearchQuery(''); setSearchResults([]); }} className="text-white/80 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {/* Search Input */}
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search colleges by name or city..."
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
              
              {/* Search Results */}
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {searchQuery.length < 2 ? (
                  <p className="text-center text-gray-500 py-4">Type at least 2 characters to search</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No colleges found</p>
                ) : (
                  searchResults.map(college => (
                    <div 
                      key={college.id}
                      onClick={() => addCollege(college, showAddModal)}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {college.logo_url ? (
                          <img src={college.logo_url} alt={college.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-lg font-bold text-gray-400">{college.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{college.name}</h4>
                        <p className="text-xs text-gray-500">
                          {college.location?.city}, {college.location?.state} • {college.type}
                        </p>
                      </div>
                      <FiPlus className="text-blue-600" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsoredAdsManagement;
