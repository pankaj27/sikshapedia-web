import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiCheck, FiX, FiDollarSign, FiChevronLeft, FiChevronRight, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../../api/axios';

const RedemptionManagement = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showModal, setShowModal] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const limit = 20;

  const fetchRedemptions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/rewards/redemptions?status=${statusFilter}&limit=${limit}&offset=${page * limit}`);
      setRedemptions(response.data.requests);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching redemptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, [page, statusFilter]);

  const handleProcess = async (redemptionId, action) => {
    setProcessing(redemptionId);
    try {
      await api.post(`/admin/rewards/redemptions/${redemptionId}/process`, {
        action,
        transaction_id: transactionId,
        admin_notes: adminNotes
      });
      setShowModal(null);
      setTransactionId('');
      setAdminNotes('');
      fetchRedemptions();
    } catch (error) {
      console.error('Error processing redemption:', error);
      alert('Error processing redemption');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm"><FiClock /> Pending</span>;
      case 'completed':
        return <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm"><FiCheckCircle /> Completed</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm"><FiXCircle /> Rejected</span>;
      default:
        return null;
    }
  };

  if (loading && redemptions.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Redemption Requests</h1>
            <p className="text-gray-500">{total} redemption requests</p>
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {['pending', 'completed', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setPage(0); }}
                className={`px-4 py-2 rounded-lg capitalize transition ${
                  statusFilter === status
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {redemptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No {statusFilter} redemptions</h2>
            <p className="text-gray-500">Try a different filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UPI ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {redemptions.map((redemption) => (
                  <tr key={redemption.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-800">{redemption.user_name}</p>
                        <p className="text-sm text-gray-500">{redemption.user_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-800">{redemption.points}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">₹{redemption.amount?.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-600 font-mono">{redemption.upi_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(redemption.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(redemption.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {redemption.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowModal({ ...redemption, action: 'complete' })}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                          >
                            Pay
                          </button>
                          <button
                            onClick={() => setShowModal({ ...redemption, action: 'reject' })}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {redemption.transaction_id && (
                            <span className="font-mono">TXN: {redemption.transaction_id}</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <FiChevronLeft /> Previous
            </button>
            <span className="text-gray-600">
              Page {page + 1} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={(page + 1) * limit >= total}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}

        {/* Process Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {showModal.action === 'complete' ? '✅ Complete Payment' : '❌ Reject Redemption'}
              </h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">User: <span className="font-semibold">{showModal.user_name}</span></p>
                <p className="text-gray-600">Amount: <span className="font-semibold text-green-600">₹{showModal.amount?.toFixed(2)}</span></p>
                <p className="text-gray-600">UPI ID: <span className="font-mono">{showModal.upi_id}</span></p>
              </div>

              {showModal.action === 'complete' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (optional)</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter UPI transaction ID"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (optional)</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes..."
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowModal(null); setTransactionId(''); setAdminNotes(''); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleProcess(showModal.id, showModal.action)}
                  disabled={processing}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition ${
                    showModal.action === 'complete'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  } disabled:opacity-50`}
                >
                  {processing ? 'Processing...' : showModal.action === 'complete' ? 'Confirm Payment' : 'Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RedemptionManagement;
