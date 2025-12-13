import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiLogOut, FiBarChart2 } from 'react-icons/fi';
import api from '../api/axios';
import { Button } from '../components/ui/button';

const InstitutionDashboard = () => {
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'institution') {
      navigate('/');
      return;
    }
    setInstitution(user);
    fetchDashboard();
  }, [navigate]);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/institution/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const badges = {
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiClock },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FiAlertCircle },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: FiCheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle }
    };
    const badge = badges[status] || badges.submitted;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>
        <Icon size={14} /> {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status`, null, {
        params: { status: newStatus }
      });
      alert('Application status updated successfully');
      fetchDashboard();
    } catch (error) {
      alert('Error updating status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Institution Portal</h1>
              <p className="text-gray-600">{institution?.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <FiLogOut /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'overview' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiBarChart2 /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'applications' ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiFileText /> Applications
                  <span className="ml-auto bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                    {dashboardData?.total_applications || 0}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Total Applications</div>
                    <div className="text-3xl font-bold text-blue-600">{dashboardData?.total_applications || 0}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Under Review</div>
                    <div className="text-3xl font-bold text-yellow-600">{dashboardData?.status_breakdown?.under_review || 0}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Accepted</div>
                    <div className="text-3xl font-bold text-green-600">{dashboardData?.status_breakdown?.accepted || 0}</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Rejected</div>
                    <div className="text-3xl font-bold text-red-600">{dashboardData?.status_breakdown?.rejected || 0}</div>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold mb-4">Recent Applications</h3>
                  {dashboardData?.recent_applications && dashboardData.recent_applications.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.recent_applications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{app.student_name}</p>
                            <p className="text-sm text-gray-600">{app.preferred_course}</p>
                            <p className="text-xs text-gray-500">{new Date(app.created_at).toLocaleDateString()}</p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No applications yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <h2 className="text-3xl font-bold mb-6">All Applications</h2>

                {dashboardData?.recent_applications && dashboardData.recent_applications.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_applications.map((app) => (
                      <div key={app.id} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{app.student_name}</h3>
                            <p className="text-gray-600">Application #{app.application_number}</p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Course</p>
                            <p className="font-semibold">{app.preferred_course}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-semibold">{app.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-semibold">{app.phone}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {app.status === 'submitted' && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(app.id, 'under_review')}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              Mark Under Review
                            </Button>
                          )}
                          {(app.status === 'submitted' || app.status === 'under_review') && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FiFileText className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No applications received yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
