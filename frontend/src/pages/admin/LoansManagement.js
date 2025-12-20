import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye, FiDollarSign, FiPercent } from 'react-icons/fi';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';

import { Link } from '../../components/CustomLink';
const LoansManagement = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans');
      setLoans(response.data);
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this loan?')) return;
    try {
      await api.delete(`/loans/${id}`);
      setLoans(loans.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting loan:', error);
      alert('Failed to delete loan');
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.bank_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.loan_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">🏦 Education Loans</h1>
            <p className="text-gray-500 mt-1">Manage education loan entries</p>
          </div>
          <Link to="/admin/loans/new">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <FiPlus className="mr-2" /> Add Loan
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiDollarSign className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{loans.length}</p>
                <p className="text-sm text-gray-500">Total Loans</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{loans.filter(l => l.is_active).length}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiPercent className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{loans.filter(l => l.is_featured).length}</p>
                <p className="text-sm text-gray-500">Featured</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiDollarSign className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{new Set(loans.map(l => l.bank_type)).size}</p>
                <p className="text-sm text-gray-500">Bank Types</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search loans by name, bank, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank/Lender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {loan.bank_logo ? (
                        <img src={loan.bank_logo} alt="" className="w-12 h-12 rounded object-contain bg-gray-50" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center">
                          <FiDollarSign className="text-blue-600" size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{loan.name}</p>
                        <p className="text-sm text-gray-500">{loan.tenure_min} - {loan.tenure_max}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{loan.bank_name}</p>
                    <p className="text-sm text-gray-500">{loan.bank_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {loan.loan_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {loan.interest_rate_min && loan.interest_rate_max 
                        ? `${loan.interest_rate_min} - ${loan.interest_rate_max}`
                        : loan.interest_rate_min || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">{loan.interest_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">
                      {loan.min_amount && loan.max_amount 
                        ? `${loan.min_amount} - ${loan.max_amount}`
                        : loan.max_amount || 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        loan.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {loan.is_active ? 'Active' : 'Inactive'}
                      </span>
                      {loan.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/loans/${loan.slug}`, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <FiEye size={18} />
                      </button>
                      <Link
                        to={`/admin/loans/edit/${loan.id}`}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(loan.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLoans.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <FiDollarSign className="mx-auto mb-3 text-gray-300" size={48} />
              <p className="text-lg font-medium">No education loans found</p>
              <p className="mt-1">Create your first loan entry to get started</p>
              <Link to="/admin/loans/new" className="mt-4 inline-block">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <FiPlus className="mr-2" /> Add Loan
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default LoansManagement;
