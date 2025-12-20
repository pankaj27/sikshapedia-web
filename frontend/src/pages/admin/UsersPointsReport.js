import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiUsers, FiChevronLeft, FiChevronRight, FiSearch, FiEdit, FiCreditCard, FiX } from 'react-icons/fi';
import api from '../../api/axios';

const UsersPointsReport = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [showAdjustModal, setShowAdjustModal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [adjustPoints, setAdjustPoints] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const limit = 50;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/rewards/users-report?limit=${limit}&offset=${page * limit}`);
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleAdjustPoints = async () => {
    if (!adjustPoints || !adjustReason) {
      alert('Please enter points and reason');
      return;
    }
    setProcessing(true);
    try {
      await api.post('/admin/rewards/adjust-points', {
        user_id: showAdjustModal.id,
        points: parseInt(adjustPoints),
        reason: adjustReason
      });
      setShowAdjustModal(null);
      setAdjustPoints(0);
      setAdjustReason('');
      fetchUsers();
    } catch (error) {
      console.error('Error adjusting points:', error);
      alert('Error adjusting points');
    } finally {
      setProcessing(false);
    }
  };

  if (loading && users.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-800">Users Points Report</h1>
            <p className="text-gray-500">{total} users with points</p>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No users with points</h2>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                      {page * limit + index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                      {user.phone || '-'}
                    </td>
                    <td className="px-4 py-4">
                      {user.payment_details?.upi_id ? (
                        <div>
                          <span className="font-mono text-green-600 text-sm">{user.payment_details.upi_id}</span>
                          <span className="text-xs text-gray-400 ml-1">(UPI)</span>
                        </div>
                      ) : user.payment_details?.account_number ? (
                        <div>
                          <span className="font-mono text-blue-600 text-sm">****{user.payment_details.account_number.slice(-4)}</span>
                          <span className="text-xs text-gray-400 ml-1">(Bank)</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Not added</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-bold text-orange-600">{user.points}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-green-600">₹{(user.points * 0.5).toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowPaymentModal(user)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
                          title="View Payment Details"
                        >
                          <FiCreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowAdjustModal(user)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          title="Adjust Points"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </div>
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

        {/* Adjust Points Modal */}
        {showAdjustModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Adjust Points</h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">User: <span className="font-semibold">{showAdjustModal.name}</span></p>
                <p className="text-gray-600">Current Points: <span className="font-semibold text-orange-600">{showAdjustModal.points}</span></p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Points to Add/Deduct</label>
                <input
                  type="number"
                  value={adjustPoints}
                  onChange={(e) => setAdjustPoints(e.target.value)}
                  placeholder="Enter points (negative to deduct)"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Use negative number to deduct points</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Enter reason for adjustment"
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAdjustModal(null); setAdjustPoints(0); setAdjustReason(''); }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjustPoints}
                  disabled={processing || !adjustReason}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Adjust Points'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Details Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
                <button onClick={() => setShowPaymentModal(null)} className="p-1 hover:bg-gray-100 rounded">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">User: <span className="font-semibold">{showPaymentModal.name}</span></p>
                <p className="text-gray-600">Email: <span className="font-semibold">{showPaymentModal.email}</span></p>
                <p className="text-gray-600">Phone: <span className="font-semibold">{showPaymentModal.phone || 'Not provided'}</span></p>
                <p className="text-gray-600">Points: <span className="font-semibold text-orange-600">{showPaymentModal.points}</span></p>
                <p className="text-gray-600">Cash Value: <span className="font-semibold text-green-600">₹{(showPaymentModal.points * 0.5).toFixed(2)}</span></p>
              </div>

              <div className="space-y-4">
                {/* UPI Details */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-700 mb-2">💳 UPI Details</h3>
                  {showPaymentModal.payment_details?.upi_id ? (
                    <p className="font-mono text-lg text-green-800">{showPaymentModal.payment_details.upi_id}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">UPI ID not provided by user</p>
                  )}
                </div>

                {/* Bank Details */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2">🏦 Bank Details</h3>
                  {showPaymentModal.payment_details?.account_number ? (
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Account Holder:</span> <span className="font-medium">{showPaymentModal.payment_details.account_holder || '-'}</span></p>
                      <p><span className="text-gray-600">Bank:</span> <span className="font-medium">{showPaymentModal.payment_details.bank_name || '-'}</span></p>
                      <p><span className="text-gray-600">Account No:</span> <span className="font-mono font-medium">{showPaymentModal.payment_details.account_number}</span></p>
                      <p><span className="text-gray-600">IFSC:</span> <span className="font-mono font-medium">{showPaymentModal.payment_details.ifsc_code || '-'}</span></p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Bank details not provided by user</p>
                  )}
                </div>

                {!showPaymentModal.payment_details?.upi_id && !showPaymentModal.payment_details?.account_number && (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ This user has not added any payment details yet. They will need to update their profile before you can process a payout.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowPaymentModal(null)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPointsReport;
