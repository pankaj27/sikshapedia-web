import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiFileText, FiHome, FiBook, FiEdit3, FiGlobe } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

import { Link } from '../../components/CustomLink';
const TYPE_ICONS = {
  college: FiHome,
  listing_page: FiGlobe,
  news: FiFileText,
  course: FiBook,
  exam: FiEdit3,
  blog: FiFileText,
};

const TYPE_COLORS = {
  college: 'bg-blue-100 text-blue-800',
  listing_page: 'bg-purple-100 text-purple-800',
  news: 'bg-green-100 text-green-800',
  course: 'bg-orange-100 text-orange-800',
  exam: 'bg-red-100 text-red-800',
  blog: 'bg-pink-100 text-pink-800',
};

const PendingApprovals = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      const response = await api.get('/admin/pending-approvals');
      setPendingItems(response.data.items);
      setTotalCount(response.data.total);
    } catch (error) {
      console.error('Error fetching pending items:', error);
      setMessage({ type: 'error', text: 'Failed to load pending items' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (item) => {
    setProcessing(true);
    try {
      await api.post(`/admin/approve/${item.type}/${item.id}`, { action: 'approve' });
      setMessage({ type: 'success', text: `${item.type_label} approved and published!` });
      fetchPendingItems();
    } catch (error) {
      console.error('Error approving:', error);
      setMessage({ type: 'error', text: 'Failed to approve content' });
    } finally {
      setProcessing(false);
    }
  };

  const openRejectModal = (item) => {
    setSelectedItem(item);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedItem) return;
    
    setProcessing(true);
    try {
      await api.post(`/admin/approve/${selectedItem.type}/${selectedItem.id}`, {
        action: 'reject',
        comment: rejectReason
      });
      setMessage({ type: 'success', text: `${selectedItem.type_label} rejected` });
      setShowRejectModal(false);
      setSelectedItem(null);
      fetchPendingItems();
    } catch (error) {
      console.error('Error rejecting:', error);
      setMessage({ type: 'error', text: 'Failed to reject content' });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredItems = filter === 'all' 
    ? pendingItems 
    : pendingItems.filter(item => item.type === filter);

  const contentTypes = [...new Set(pendingItems.map(item => item.type))];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
            <p className="text-gray-600 mt-1">Review and approve content submissions</p>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg">
            <FiClock size={20} />
            <span className="font-semibold">{totalCount} items pending</span>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({pendingItems.length})
          </button>
          {contentTypes.map(type => {
            const count = pendingItems.filter(item => item.type === type).length;
            const Icon = TYPE_ICONS[type] || FiFileText;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === type ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon size={14} />
                {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({count})
              </button>
            );
          })}
        </div>

        {/* Pending Items List */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <FiCheck className="mx-auto text-green-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-2">No content pending approval</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const Icon = TYPE_ICONS[item.type] || FiFileText;
                  return (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${TYPE_COLORS[item.type] || 'bg-gray-100'}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <Link to={item.url} className="text-xs text-orange-600 hover:underline">
                              View / Edit
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-800'}`}>
                          {item.type_label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.submitted_by || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(item.submitted_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleApprove(item)}
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                          >
                            <FiCheck className="mr-1" size={14} /> Approve
                          </Button>
                          <Button
                            onClick={() => openRejectModal(item)}
                            disabled={processing}
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 text-xs px-3 py-1"
                          >
                            <FiX className="mr-1" size={14} /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Reject Content</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Rejecting: {selectedItem?.name}
                </p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide feedback for the content creator..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                />
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={processing}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {processing ? 'Rejecting...' : 'Reject Content'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PendingApprovals;
