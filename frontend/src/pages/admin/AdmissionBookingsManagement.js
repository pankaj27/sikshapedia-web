/**
 * AdmissionBookingsManagement - Admin panel for viewing all admission bookings
 */
import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiEye, FiCheck, FiX, FiClock, FiDollarSign, FiUsers, FiSettings } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

const AdmissionBookingsManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    form_fee: 1000,
    platform_fee: 250,
    gst_percentage: 18
  });
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchSettings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      
      const response = await api.get('/admission/admin/bookings', { params });
      setBookings(response.data.bookings || []);
      setStats(response.data.stats || {});
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admission/settings');
      setSettings(response.data);
      setSettingsForm({
        form_fee: response.data.form_fee || 1000,
        platform_fee: response.data.platform_fee || 250,
        gst_percentage: response.data.gst_percentage || 18
      });
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.put('/admission/settings', {
        id: 'admission_settings',
        ...settingsForm
      });
      setShowSettings(false);
      fetchSettings();
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending_payment': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Payment' },
      'submitted': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
      'approved': { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
      'rejected': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' }
    };
    const badge = badges[status] || badges['submitted'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter(b =>
    b.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.institution_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateTotalRevenue = () => {
    return bookings
      .filter(b => b.payment_status === 'completed')
      .reduce((sum, b) => sum + (b.total_amount || 0), 0);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admission Bookings</h1>
            <p className="text-gray-500">Manage all admission applications</p>
          </div>
          <Button onClick={() => setShowSettings(true)} className="flex items-center gap-2">
            <FiSettings /> Fee Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending_payment || 0}</p>
                <p className="text-sm text-gray-500">Pending Payment</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiEye className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.submitted || 0}</p>
                <p className="text-sm text-gray-500">Submitted</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheck className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved || 0}</p>
                <p className="text-sm text-gray-500">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiDollarSign className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">₹{calculateTotalRevenue().toLocaleString()}</p>
                <p className="text-sm text-gray-500">Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, institution, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending_payment', 'submitted', 'approved', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No bookings found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Institution</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{booking.id?.slice(0, 15)}...</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{booking.student_name}</p>
                      <p className="text-xs text-gray-500">{booking.mobile}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-800">{booking.institution_name}</p>
                      <p className="text-xs text-gray-500 capitalize">{booking.institution_type}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{booking.course_or_class}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">₹{booking.total_amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.payment_status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <FiEye size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Admission Fee Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Fee (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.form_fee}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, form_fee: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.platform_fee}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, platform_fee: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST (%)</label>
                  <input
                    type="number"
                    value={settingsForm.gst_percentage}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, gst_percentage: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Total: ₹{(settingsForm.form_fee + settingsForm.platform_fee) * (1 + settingsForm.gst_percentage / 100)}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={() => setShowSettings(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings} className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>ID:</strong> {selectedBooking.id}</div>
                <div><strong>Status:</strong> {getStatusBadge(selectedBooking.status)}</div>
                <div><strong>Student:</strong> {selectedBooking.student_name}</div>
                <div><strong>Father:</strong> {selectedBooking.father_name}</div>
                <div><strong>Mother:</strong> {selectedBooking.mother_name}</div>
                <div><strong>DOB:</strong> {selectedBooking.dob}</div>
                <div><strong>Mobile:</strong> {selectedBooking.mobile}</div>
                <div><strong>Email:</strong> {selectedBooking.email}</div>
                <div><strong>Aadhaar:</strong> {selectedBooking.aadhaar_number}</div>
                <div><strong>Institution:</strong> {selectedBooking.institution_name}</div>
                <div><strong>Course/Class:</strong> {selectedBooking.course_or_class}</div>
                <div><strong>Last Qualification:</strong> {selectedBooking.last_qualification}</div>
                <div className="col-span-2"><strong>Address:</strong> {selectedBooking.address}, {selectedBooking.city}, {selectedBooking.state} - {selectedBooking.pin}</div>
                <div><strong>Amount:</strong> ₹{selectedBooking.total_amount}</div>
                <div><strong>Payment:</strong> {selectedBooking.payment_status}</div>
              </div>

              {selectedBooking.institution_comments && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <strong>Institution Comments:</strong>
                  <p className="text-gray-600 mt-1">{selectedBooking.institution_comments}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {selectedBooking.photo_url && (
                  <a href={selectedBooking.photo_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Photo</a>
                )}
                {selectedBooking.aadhaar_doc_url && (
                  <a href={selectedBooking.aadhaar_doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Aadhaar</a>
                )}
                {selectedBooking.qualification_doc_url && (
                  <a href={selectedBooking.qualification_doc_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">View Qualification</a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdmissionBookingsManagement;
