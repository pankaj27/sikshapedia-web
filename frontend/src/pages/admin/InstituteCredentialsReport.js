import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FiDownload, FiSearch, FiEye, FiEyeOff, FiCopy, FiCheck, FiMail, FiPhone } from 'react-icons/fi';
import api from '../../api/axios';

const InstituteCredentialsReport = () => {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/credential-reports');
      setCredentials(response.data || []);
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (id) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const filteredCredentials = credentials.filter(cred => {
    const search = searchTerm.toLowerCase();
    return (
      cred.institution_name?.toLowerCase().includes(search) ||
      cred.login_email?.toLowerCase().includes(search) ||
      cred.institution_id?.toLowerCase().includes(search)
    );
  });

  const exportToCSV = () => {
    const headers = ['Institution Name', 'Institution ID', 'Login Email', 'Password', 'Contact Email', 'Contact Phone', 'Created At'];
    const rows = filteredCredentials.map(cred => [
      cred.institution_name || '',
      cred.institution_id || '',
      cred.login_email || '',
      cred.temp_password || '',
      cred.contact_email || '',
      cred.contact_phone || '',
      cred.created_at ? new Date(cred.created_at).toLocaleString() : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `institute_credentials_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Institute Credentials Report</h1>
            <p className="text-gray-600 mt-1">View login credentials for all registered institutes</p>
          </div>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <FiDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-medium">Total Institutes</p>
            <p className="text-2xl font-bold text-blue-700">{credentials.length}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-600 font-medium">Email Sent</p>
            <p className="text-2xl font-bold text-green-700">
              {credentials.filter(c => c.email_sent).length}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm text-purple-600 font-medium">WhatsApp Sent</p>
            <p className="text-2xl font-bold text-purple-700">
              {credentials.filter(c => c.whatsapp_sent).length}
            </p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">No institute credentials found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Institute</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Login Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Password</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCredentials.map((cred) => (
                    <tr key={cred.id || cred.institution_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{cred.institution_name}</p>
                          <p className="text-xs text-gray-500">ID: {cred.institution_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700">{cred.login_email}</span>
                          <button
                            onClick={() => copyToClipboard(cred.login_email, `email-${cred.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy email"
                          >
                            {copiedId === `email-${cred.id}` ? (
                              <FiCheck className="w-4 h-4 text-green-500" />
                            ) : (
                              <FiCopy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {showPasswords[cred.id] ? cred.temp_password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePassword(cred.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title={showPasswords[cred.id] ? "Hide password" : "Show password"}
                          >
                            {showPasswords[cred.id] ? (
                              <FiEyeOff className="w-4 h-4" />
                            ) : (
                              <FiEye className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(cred.temp_password, `pass-${cred.id}`)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy password"
                          >
                            {copiedId === `pass-${cred.id}` ? (
                              <FiCheck className="w-4 h-4 text-green-500" />
                            ) : (
                              <FiCopy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {cred.contact_email && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <FiMail className="w-3 h-3" />
                              <span>{cred.contact_email}</span>
                            </div>
                          )}
                          {cred.contact_phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <FiPhone className="w-3 h-3" />
                              <span>{cred.contact_phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {cred.email_sent && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                              ✉️ Email Sent
                            </span>
                          )}
                          {cred.whatsapp_sent && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                              📱 WhatsApp Sent
                            </span>
                          )}
                          {!cred.email_sent && !cred.whatsapp_sent && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {cred.created_at ? new Date(cred.created_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InstituteCredentialsReport;
