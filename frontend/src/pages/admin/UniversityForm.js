/**
 * UniversityForm - Admin form to create/edit universities
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, FiX, FiPlus, FiTrash2, FiAward, FiMapPin, FiMail, FiPhone, FiGlobe,
  FiInfo, FiBarChart2, FiUsers, FiBriefcase, FiStar, FiChevronDown, FiChevronRight
} from 'react-icons/fi';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = false, icon = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-purple-600">{icon}</span>}
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        </div>
        {isOpen ? <FiChevronDown className="text-gray-500" /> : <FiChevronRight className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

const UniversityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    university_type: 'Central',
    accreditation: '',
    city: '',
    state: '',
    address: '',
    established_year: null,
    is_admission_partner: false,
    admission_fees: {
      form_fee: 500,
      platform_fee: 200,
      gst_percentage: 18
    },
    streams: [],
    total_courses: 0,
    total_colleges: 0,
    total_students: null,
    total_faculty: null,
    nirf_rank: null,
    rating: 0,
    total_reviews: 0,
    placement_percentage: null,
    highest_package: null,
    average_package: null,
    phone: '',
    email: '',
    website: '',
    logo: '',
    description: '',
    highlights: [],
    courses: []
  });

  const universityTypes = ['Central', 'State', 'Private', 'Deemed', 'Institute of National Importance'];
  const accreditationOptions = ['NAAC A++', 'NAAC A+', 'NAAC A', 'NAAC B++', 'NAAC B+', 'NAAC B', 'NBA', 'UGC Recognized', 'AICTE Approved'];
  const streamOptions = ['Engineering', 'Medical', 'Management', 'Science', 'Arts', 'Commerce', 'Law', 'Architecture', 'Design', 'Agriculture', 'Pharmacy', 'Education'];
  const stateOptions = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

  useEffect(() => {
    if (isEdit) {
      fetchUniversity();
    }
  }, [id]);

  const fetchUniversity = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/universities/${id}`);
      setFormData(res.data);
    } catch (error) {
      console.error('Error fetching university:', error);
      alert('Failed to load university');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : generateSlug(name)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEdit) {
        await api.put(`/universities/${id}`, formData);
        alert('University updated successfully');
      } else {
        await api.post('/universities', formData);
        alert('University created successfully');
      }
      navigate('/admin/admission-partners/universities');
    } catch (error) {
      console.error('Error saving university:', error);
      alert('Failed to save university');
    } finally {
      setSaving(false);
    }
  };

  const addStream = (stream) => {
    if (stream && !formData.streams.includes(stream)) {
      setFormData(prev => ({
        ...prev,
        streams: [...prev.streams, stream]
      }));
    }
  };

  const removeStream = (stream) => {
    setFormData(prev => ({
      ...prev,
      streams: prev.streams.filter(s => s !== stream)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiAward className="text-purple-600" />
              {isEdit ? 'Edit University' : 'Add New University'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update university details' : 'Create a new university entry'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <FiX className="mr-2" /> Cancel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <CollapsibleSection title="Basic Information" icon={<FiInfo />} defaultOpen={true}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University Type *</label>
                <select
                  value={formData.university_type}
                  onChange={(e) => setFormData({...formData, university_type: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {universityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
                <select
                  value={formData.accreditation}
                  onChange={(e) => setFormData({...formData, accreditation: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Accreditation</option>
                  {accreditationOptions.map(acc => (
                    <option key={acc} value={acc}>{acc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input
                  type="number"
                  value={formData.established_year || ''}
                  onChange={(e) => setFormData({...formData, established_year: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 1950"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo || ''}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Location */}
          <CollapsibleSection title="Location" icon={<FiMapPin />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select State</option>
                  {stateOptions.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Contact */}
          <CollapsibleSection title="Contact Information" icon={<FiMail />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Streams */}
          <CollapsibleSection title="Streams Offered" icon={<FiAward />}>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {formData.streams.map(stream => (
                  <span key={stream} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                    {stream}
                    <button type="button" onClick={() => removeStream(stream)} className="hover:text-red-600">
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  onChange={(e) => { addStream(e.target.value); e.target.value = ''; }}
                  className="flex-1 px-3 py-2 border rounded-lg"
                >
                  <option value="">Add Stream...</option>
                  {streamOptions.filter(s => !formData.streams.includes(s)).map(stream => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>
            </div>
          </CollapsibleSection>

          {/* Stats */}
          <CollapsibleSection title="Statistics & Rankings" icon={<FiBarChart2 />}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIRF Rank</label>
                <input
                  type="number"
                  value={formData.nirf_rank || ''}
                  onChange={(e) => setFormData({...formData, nirf_rank: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating || 0}
                  onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Colleges</label>
                <input
                  type="number"
                  value={formData.total_colleges || 0}
                  onChange={(e) => setFormData({...formData, total_colleges: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Courses</label>
                <input
                  type="number"
                  value={formData.total_courses || 0}
                  onChange={(e) => setFormData({...formData, total_courses: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                <input
                  type="number"
                  value={formData.total_students || ''}
                  onChange={(e) => setFormData({...formData, total_students: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Faculty</label>
                <input
                  type="number"
                  value={formData.total_faculty || ''}
                  onChange={(e) => setFormData({...formData, total_faculty: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Placements */}
          <CollapsibleSection title="Placement Statistics" icon={<FiBriefcase />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placement % </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.placement_percentage || ''}
                  onChange={(e) => setFormData({...formData, placement_percentage: e.target.value ? parseFloat(e.target.value) : null})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 85.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Highest Package (LPA)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.highest_package || ''}
                  onChange={(e) => setFormData({...formData, highest_package: e.target.value ? parseFloat(e.target.value) : null})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 45.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Average Package (LPA)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.average_package || ''}
                  onChange={(e) => setFormData({...formData, average_package: e.target.value ? parseFloat(e.target.value) : null})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 12.5"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Admission Partner */}
          <CollapsibleSection title="Admission Partner Settings" icon={<FiStar />}>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_admission_partner}
                  onChange={(e) => setFormData({...formData, is_admission_partner: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="font-medium text-gray-700">Enable as Admission Partner</span>
              </label>
              
              {formData.is_admission_partner && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3">Admission Fee Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Form Fee (₹)</label>
                      <input
                        type="number"
                        value={formData.admission_fees?.form_fee || 500}
                        onChange={(e) => setFormData({...formData, admission_fees: {...formData.admission_fees, form_fee: parseInt(e.target.value)}})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (₹)</label>
                      <input
                        type="number"
                        value={formData.admission_fees?.platform_fee || 200}
                        onChange={(e) => setFormData({...formData, admission_fees: {...formData.admission_fees, platform_fee: parseInt(e.target.value)}})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GST %</label>
                      <input
                        type="number"
                        value={formData.admission_fees?.gst_percentage || 18}
                        onChange={(e) => setFormData({...formData, admission_fees: {...formData.admission_fees, gst_percentage: parseInt(e.target.value)}})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700">
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" /> {isEdit ? 'Update University' : 'Create University'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default UniversityForm;
