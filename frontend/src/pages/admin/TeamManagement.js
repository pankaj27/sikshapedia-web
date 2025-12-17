import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiMail, FiShield, FiCheck, FiX } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../api/axios';
import { Button } from '../../components/ui/button';

const ROLE_LABELS = {
  super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800' },
  content_manager: { label: 'Content Manager', color: 'bg-blue-100 text-blue-800' },
  data_entry: { label: 'Data Entry', color: 'bg-green-100 text-green-800' },
};

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'data_entry',
    job_title: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await api.get('/admin/team');
      setTeam(response.data);
    } catch (error) {
      console.error('Error fetching team:', error);
      setMessage({ type: 'error', text: 'Failed to load team members' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        password: '',
        role: member.role,
        job_title: member.job_title || '',
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'data_entry',
        job_title: '',
      });
    }
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'data_entry',
      job_title: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingMember) {
        // Update existing member
        const updateData = {
          name: formData.name,
          role: formData.role,
          job_title: formData.job_title,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await api.put(`/admin/team/${editingMember.id}`, updateData);
        setMessage({ type: 'success', text: 'Team member updated successfully!' });
      } else {
        // Create new member
        if (!formData.password) {
          setMessage({ type: 'error', text: 'Password is required for new members' });
          setSaving(false);
          return;
        }
        await api.post('/admin/team', formData);
        setMessage({ type: 'success', text: 'Team member created successfully!' });
      }
      fetchTeam();
      setTimeout(() => handleCloseModal(), 1500);
    } catch (error) {
      console.error('Error saving team member:', error);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to save team member' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) return;

    try {
      await api.delete(`/admin/team/${member.id}`);
      setMessage({ type: 'success', text: 'Team member deleted successfully!' });
      fetchTeam();
    } catch (error) {
      console.error('Error deleting team member:', error);
      setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to delete team member' });
    }
  };

  const handleToggleActive = async (member) => {
    try {
      await api.put(`/admin/team/${member.id}`, { is_active: !member.is_active });
      fetchTeam();
    } catch (error) {
      console.error('Error toggling member status:', error);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their roles</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="bg-orange-600 hover:bg-orange-700 text-white">
            <FiPlus className="mr-2" /> Add Team Member
          </Button>
        </div>

        {/* Message */}
        {message.text && !showModal && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Role Legend */}
        <div className="mb-6 flex gap-4">
          {Object.entries(ROLE_LABELS).map(([role, { label, color }]) => (
            <div key={role} className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Team Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        {member.profile_photo ? (
                          <img src={member.profile_photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                            <FiUser size={18} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        {member.job_title && <p className="text-xs text-gray-400">{member.job_title}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${ROLE_LABELS[member.role]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {ROLE_LABELS[member.role]?.label || member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(member)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        member.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.is_active !== false ? <FiCheck size={12} /> : <FiX size={12} />}
                      {member.is_active !== false ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {member.created_at ? new Date(member.created_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {team.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No team members found. Add your first team member!
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {message.text && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {message.text}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUser className="inline mr-1" /> Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMail className="inline mr-1" /> Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                    disabled={!!editingMember}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password {editingMember ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required={!editingMember}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiShield className="inline mr-1" /> Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="data_entry">Data Entry</option>
                    <option value="content_manager">Content Manager</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="e.g., Content Writer, Data Analyst"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {saving ? 'Saving...' : (editingMember ? 'Update' : 'Create')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TeamManagement;
