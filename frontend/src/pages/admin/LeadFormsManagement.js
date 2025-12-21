import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheck, FiX, FiMessageSquare, FiVolume2 } from 'react-icons/fi';
import { HiOutlineOfficeBuilding, HiOutlineSpeakerphone } from 'react-icons/hi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const LeadFormsManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, register_institute, advertise_with_us
  const [statusFilter, setStatusFilter] = useState('all'); // all, new, contacted, converted, closed
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/lead-forms/admin/submissions?limit=100');
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/lead-forms/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/lead-forms/admin/submissions/${id}/status?status=${newStatus}`);
      setSubmissions(submissions.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredSubmissions = submissions.filter(s => {
    if (filter !== 'all' && s.form_type !== filter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lead Forms Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage Register Institute and Advertise With Us submissions</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineOfficeBuilding className="text-indigo-500" size={16} />
                <p className="text-sm text-gray-600">Institute Registrations</p>
              </div>
              <p className="text-2xl font-bold text-indigo-600">{stats.by_type?.register_institute || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineSpeakerphone className="text-orange-500" size={16} />
                <p className="text-sm text-gray-600">Advertise Requests</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.by_type?.advertise_with_us || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600">New (Pending)</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.by_status?.new || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-green-600">{stats.by_status?.converted || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-1 border border-gray-100 inline-flex">
            {[
              { value: 'all', label: 'All Types' },
              { value: 'register_institute', label: 'Institute Registration' },
              { value: 'advertise_with_us', label: 'Advertise Requests' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.value
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-1 border border-gray-100 inline-flex">
            {[
              { value: 'all', label: 'All Status' },
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'converted', label: 'Converted' },
              { value: 'closed', label: 'Closed' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusFilter === tab.value
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <p className="text-gray-500">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No submissions found</p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {submission.form_type === 'register_institute' ? (
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <HiOutlineOfficeBuilding className="text-indigo-600" size={20} />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <HiOutlineSpeakerphone className="text-orange-600" size={20} />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {submission.institute_name || submission.company_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {submission.form_type === 'register_institute' ? 'Institute Registration' : 'Advertise Request'}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiUser size={14} />
                    <span>{submission.contact_person}</span>
                    {submission.designation && <span className="text-gray-400">({submission.designation})</span>}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMail size={14} />
                    <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">{submission.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiPhone size={14} />
                    <a href={`tel:${submission.phone}`} className="text-blue-600 hover:underline">{submission.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={14} />
                    <span>{formatDate(submission.created_at)}</span>
                  </div>
                </div>

                {submission.form_type === 'register_institute' && (
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiMapPin size={14} />
                      <span>{submission.city}, {submission.state}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{submission.institute_type}</span>
                  </div>
                )}

                {submission.form_type === 'advertise_with_us' && (
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded text-xs">
                      {submission.advertising_interest}
                    </span>
                    {submission.budget_range && (
                      <span className="text-gray-500">Budget: ₹{submission.budget_range}</span>
                    )}
                  </div>
                )}

                {submission.message && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">{submission.message}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  {submission.status === 'new' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(submission.id, 'contacted')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Mark Contacted
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(submission.id, 'converted')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <FiCheck size={14} className="mr-1" /> Convert
                      </Button>
                    </>
                  )}
                  {submission.status === 'contacted' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(submission.id, 'converted')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <FiCheck size={14} className="mr-1" /> Convert
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(submission.id, 'closed')}
                        className="text-gray-600"
                      >
                        <FiX size={14} className="mr-1" /> Close
                      </Button>
                    </>
                  )}
                  {(submission.status === 'converted' || submission.status === 'closed') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(submission.id, 'new')}
                      className="text-blue-600"
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default LeadFormsManagement;
