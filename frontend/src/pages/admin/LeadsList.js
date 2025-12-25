import React, { useState, useEffect } from 'react';
import { Link } from '../../components/CustomLink';
import { 
  FiSearch, FiFilter, FiDownload, FiPhone, FiMail, FiMapPin, FiBook, 
  FiUser, FiClock, FiCheckCircle, FiXCircle, FiMessageCircle, FiEdit2,
  FiChevronLeft, FiChevronRight, FiRefreshCw, FiTrash2, FiHome, FiArrowRight
} from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'converted', label: 'Converted', color: 'bg-green-100 text-green-700' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-700' }
];

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Edit modal
  const [editingLead, setEditingLead] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', notes: '' });

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, sourceFilter, startDate, endDate]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('limit', limit);
      params.append('skip', (page - 1) * limit);
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (sourceFilter) params.append('source', sourceFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await api.get(`/leads?${params.toString()}`);
      setLeads(response.data.leads || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await api.get(`/leads/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to export leads:', err);
      alert('Failed to export leads');
    }
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      await api.put(`/leads/${leadId}`, { status: newStatus });
      fetchLeads();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const handleEditSave = async () => {
    if (!editingLead) return;
    try {
      await api.put(`/leads/${editingLead.id}`, editForm);
      setEditingLead(null);
      fetchLeads();
    } catch (err) {
      console.error('Failed to update lead:', err);
      alert('Failed to update lead');
    }
  };

  const handleDelete = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${leadId}`);
      fetchLeads();
    } catch (err) {
      console.error('Failed to delete lead:', err);
      alert('Failed to delete lead');
    }
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setEditForm({ status: lead.status, notes: lead.notes || '' });
  };

  const getStatusBadge = (status) => {
    const option = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
        {option.label}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leads / Inquiries</h1>
            <p className="text-gray-600">Manage and follow up on student inquiries</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchLeads}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Export CSV
            </button>
            <Link
              to="/admin/lead-settings"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email, mobile..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </form>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Status</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={sourceFilter}
                onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">All Sources</option>
                <option value="general">General</option>
                <option value="college">College Page</option>
                <option value="floating_cta">Floating CTA</option>
                <option value="header_cta">Header CTA</option>
                <option value="listing_page">Listing Page</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Start Date"
              />
            </div>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-600 text-sm">Total Leads</p>
            <p className="text-2xl font-bold text-blue-700">{total}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-yellow-600 text-sm">New</p>
            <p className="text-2xl font-bold text-yellow-700">{leads.filter(l => l.status === 'new').length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-600 text-sm">Converted</p>
            <p className="text-2xl font-bold text-green-700">{leads.filter(l => l.status === 'converted').length}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Closed</p>
            <p className="text-2xl font-bold text-gray-700">{leads.filter(l => l.status === 'closed').length}</p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiUser className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Lead Info</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Contact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Interest</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Notifications</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-800">{lead.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FiMapPin className="w-3 h-3" /> {lead.city}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            <FiMail className="w-3 h-3" /> {lead.email}
                          </a>
                          <a href={`tel:${lead.mobile}`} className="text-sm text-green-600 hover:underline flex items-center gap-1">
                            <FiPhone className="w-3 h-3" /> {lead.mobile}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{lead.course_interested}</p>
                          <p className="text-xs text-gray-500">{lead.college_name || 'General'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                          className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer ${
                            STATUS_OPTIONS.find(o => o.value === lead.status)?.color || 'bg-gray-100'
                          }`}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {lead.email_sent && (
                            <span className="flex items-center gap-1 text-xs text-green-600" title="Email sent">
                              <FiMail className="w-3 h-3" /> ✓
                            </span>
                          )}
                          {lead.whatsapp_sent && (
                            <span className="flex items-center gap-1 text-xs text-green-600" title="WhatsApp sent">
                              <FiMessageCircle className="w-3 h-3" /> ✓
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-500">{formatDate(lead.created_at)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(lead)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <a
                            href={`https://wa.me/91${lead.mobile.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                            title="WhatsApp"
                          >
                            <FiMessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(lead.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} leads
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border rounded bg-orange-50 text-orange-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setEditingLead(null)}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-4">Edit Lead: {editingLead.name}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 h-24"
                    placeholder="Add notes about this lead..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LeadsList;
