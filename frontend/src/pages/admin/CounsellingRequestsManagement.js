import React, { useState, useEffect } from 'react';
import { FiPhone, FiUser, FiClock, FiCalendar, FiCheck, FiX, FiMessageSquare } from 'react-icons/fi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const CounsellingRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, called, completed, no_response

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/lead-forms/admin/counselling-requests?limit=100');
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus, notes = null) => {
    try {
      const url = notes 
        ? `/lead-forms/admin/counselling-requests/${id}/status?status=${newStatus}&notes=${encodeURIComponent(notes)}`
        : `/lead-forms/admin/counselling-requests/${id}/status?status=${newStatus}`;
      
      await api.put(url);
      setRequests(requests.map(r => 
        r.id === id ? { ...r, status: newStatus, notes: notes || r.notes } : r
      ));
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

  const getPreferredTimeLabel = (time) => {
    const labels = {
      morning: '🌅 Morning (9 AM - 12 PM)',
      afternoon: '☀️ Afternoon (12 PM - 5 PM)',
      evening: '🌆 Evening (5 PM - 8 PM)'
    };
    return labels[time] || time;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'called': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'no_response': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  // Calculate stats
  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    called: requests.filter(r => r.status === 'called').length,
    completed: requests.filter(r => r.status === 'completed').length,
    no_response: requests.filter(r => r.status === 'no_response').length
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Counselling Requests</h1>
          <p className="text-sm text-gray-600 mt-1">Manage callback requests from students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">New</p>
            <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Called</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.called}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-600">No Response</p>
            <p className="text-2xl font-bold text-red-600">{stats.no_response}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 border border-gray-100 inline-flex">
          {[
            { value: 'all', label: 'All' },
            { value: 'new', label: 'New' },
            { value: 'called', label: 'Called' },
            { value: 'completed', label: 'Completed' },
            { value: 'no_response', label: 'No Response' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.value
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.value === 'all' ? stats.total : stats[tab.value]})
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <p className="text-gray-500">Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <FiMessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No counselling requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{request.name}</h3>
                      <a 
                        href={`tel:${request.phone}`} 
                        className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                      >
                        <FiPhone size={16} />
                        {request.phone}
                      </a>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock size={16} />
                    <span>{getPreferredTimeLabel(request.preferred_time)}</span>
                  </div>
                  {request.interest && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">Interest: {request.interest}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={16} />
                    <span>{formatDate(request.created_at)}</span>
                  </div>
                </div>

                {request.called_at && (
                  <p className="text-sm text-gray-500 mb-3">
                    Called at: {formatDate(request.called_at)}
                  </p>
                )}

                {request.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700"><strong>Notes:</strong> {request.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  {request.status === 'new' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(request.id, 'called')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        <FiPhone size={14} className="mr-1" /> Mark Called
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(request.id, 'no_response')}
                        className="text-red-600 border-red-200"
                      >
                        <FiX size={14} className="mr-1" /> No Response
                      </Button>
                    </>
                  )}
                  {request.status === 'called' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(request.id, 'completed')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <FiCheck size={14} className="mr-1" /> Mark Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const notes = prompt('Add notes (optional):');
                          updateStatus(request.id, 'called', notes);
                        }}
                        className="text-gray-600"
                      >
                        Add Notes
                      </Button>
                    </>
                  )}
                  {(request.status === 'completed' || request.status === 'no_response') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(request.id, 'new')}
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

export default CounsellingRequestsManagement;
